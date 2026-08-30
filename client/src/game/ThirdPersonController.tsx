import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CharacterAvatar from '../characters/CharacterAvatar';
import { characters } from '../characters/characterData';

const MOVE_SPEED = 5;
const JUMP_FORCE = 6.5;

type ThirdPersonControllerProps = {
  characterId: string;
};

export default function ThirdPersonController({characterId,}: ThirdPersonControllerProps){
  const bodyRef = useRef<RapierRigidBody>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
    const character =
  characters.find((item) => item.id === characterId) ??
  characters[0];
  const { camera } = useThree();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame(() => {
    const body = bodyRef.current;
    const avatar = avatarRef.current;

    if (!body || !avatar) return;

    const position = body.translation();
    const velocity = body.linvel();

    const input = new THREE.Vector3();

    if (keys.current['KeyW']) input.z -= 1;
    if (keys.current['KeyS']) input.z += 1;
    if (keys.current['KeyA']) input.x -= 1;
    if (keys.current['KeyD']) input.x += 1;

    if (input.lengthSq() > 0) {
      input.normalize();

      body.setLinvel(
        {
          x: input.x * MOVE_SPEED,
          y: velocity.y,
          z: input.z * MOVE_SPEED,
        },
        true
      );

      const angle = Math.atan2(input.x, input.z);
      avatar.rotation.y = angle;
    } else {
      body.setLinvel(
        {
          x: 0,
          y: velocity.y,
          z: 0,
        },
        true
      );
    }

    const cameraTarget = new THREE.Vector3(
      position.x,
      position.y + 1,
      position.z
    );

    const desiredCameraPosition = new THREE.Vector3(
      position.x,
      position.y + 3,
      position.z + 6
    );

    camera.position.lerp(desiredCameraPosition, 0.08);
    camera.lookAt(cameraTarget);
  });

  useEffect(() => {
    const onJump = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;

      const body = bodyRef.current;
      if (!body) return;

      const velocity = body.linvel();

      if (Math.abs(velocity.y) < 0.1) {
        body.setLinvel(
          {
            x: velocity.x,
            y: JUMP_FORCE,
            z: velocity.z,
          },
          true
        );
      }
    };

    window.addEventListener('keydown', onJump);

    return () => {
      window.removeEventListener('keydown', onJump);
    };
  }, []);

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 2, 6]}
      colliders={false}
      enabledRotations={[false, false, false]}
      friction={0}
    >
      <CapsuleCollider args={[0.6, 0.35]} />

      <group ref={avatarRef} position={[0, -0.95, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
          <meshStandardMaterial color="#6366f1" />
        </mesh>

        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#f1c27d" />
        </mesh>
         <CharacterAvatar color={character.color} />
      </group>
    </RigidBody>
  );
}