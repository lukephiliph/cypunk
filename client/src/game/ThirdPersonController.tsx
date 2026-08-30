import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import AnimatedCharacter from '../characters/AnimatedCharacter';

const MOVE_SPEED = 5;
const JUMP_FORCE = 6.5;

type ThirdPersonControllerProps = {
  characterId: string;
};

export default function ThirdPersonController({
  characterId,
}: ThirdPersonControllerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const avatarRef = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});

  const { camera } = useThree();

  const [isMoving, setIsMoving] = useState(false);

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  /*
   * Jump
   */
  useEffect(() => {
    const handleJump = (event: KeyboardEvent) => {
      if (event.code !== 'Space') {
        return;
      }

      const body = bodyRef.current;

      if (!body) {
        return;
      }

      const velocity = body.linvel();

      /*
       * Temporary grounded check.
       *
       * Later we'll replace this with a proper
       * Rapier ground raycast.
       */
      const isGrounded = Math.abs(velocity.y) < 0.1;

      if (!isGrounded) {
        return;
      }

      body.setLinvel(
        {
          x: velocity.x,
          y: JUMP_FORCE,
          z: velocity.z,
        },
        true
      );
    };

    window.addEventListener('keydown', handleJump);

    return () => {
      window.removeEventListener('keydown', handleJump);
    };
  }, []);

  /*
   * Game loop
   */
  useFrame(() => {
    const body = bodyRef.current;
    const avatar = avatarRef.current;

    if (!body || !avatar) {
      return;
    }

    const position = body.translation();
    const velocity = body.linvel();

    /*
     * --------------------------------------------------
     * PLAYER INPUT
     * --------------------------------------------------
     */

    const input = new THREE.Vector3();

    if (keys.current['KeyW']) {
      input.z -= 1;
    }

    if (keys.current['KeyS']) {
      input.z += 1;
    }

    if (keys.current['KeyA']) {
      input.x -= 1;
    }

    if (keys.current['KeyD']) {
      input.x += 1;
    }

    const moving = input.lengthSq() > 0;

    /*
     * Only update React state when movement state changes.
     */
    if (moving !== isMoving) {
      setIsMoving(moving);
    }

    /*
     * --------------------------------------------------
     * PLAYER MOVEMENT
     * --------------------------------------------------
     */

    if (moving) {
      input.normalize();

      body.setLinvel(
        {
          x: input.x * MOVE_SPEED,
          y: velocity.y,
          z: input.z * MOVE_SPEED,
        },
        true
      );

      /*
       * Rotate avatar toward movement direction.
       */
      const targetRotation = Math.atan2(
        input.x,
        input.z
      );

      avatar.rotation.y = targetRotation;
    } else {
      /*
       * Stop horizontal movement while preserving
       * vertical velocity for gravity/jumping.
       */
      body.setLinvel(
        {
          x: 0,
          y: velocity.y,
          z: 0,
        },
        true
      );
    }

    /*
     * --------------------------------------------------
     * THIRD-PERSON CAMERA
     * --------------------------------------------------
     */

    const cameraTarget = new THREE.Vector3(
      position.x,
      position.y + 0.8,
      position.z
    );

    const desiredCameraPosition = new THREE.Vector3(
      position.x,
      position.y + 3,
      position.z + 6
    );

    /*
     * Smooth camera movement.
     */
    camera.position.lerp(
      desiredCameraPosition,
      0.08
    );

    camera.lookAt(cameraTarget);
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 2, 6]}
      colliders={false}
      enabledRotations={[false, false, false]}
      friction={0}
      linearDamping={0}
    >
      {/*
       * Physical player collider.
       */}
      <CapsuleCollider args={[0.6, 0.35]} />

      {/*
       * Visible player character.
       *
       * The GLB model lives inside this group so
       * we can rotate the visual character without
       * rotating the physics body.
       */}
      <group
        ref={avatarRef}
        position={[0, -0.95, 0]}
      >
        <AnimatedCharacter
          moving={isMoving}
        />
      </group>
    </RigidBody>
  );
}
