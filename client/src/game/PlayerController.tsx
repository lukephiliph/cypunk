import { PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MOVE_SPEED = 6;
const JUMP_FORCE = 7;

export default function PlayerController() {
  const { camera } = useThree();

  const bodyRef = useRef<RapierRigidBody>(null);
  const keys = useRef<Record<string, boolean>>({});

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

  useFrame(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    const position = body.translation();
    const velocity = body.linvel();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(
      forward.z,
      0,
      -forward.x
    ).normalize();

    const movement = new THREE.Vector3();

    if (keys.current['KeyW']) {
      movement.add(forward);
    }

    if (keys.current['KeyS']) {
      movement.sub(forward);
    }

    if (keys.current['KeyD']) {
      movement.add(right);
    }

    if (keys.current['KeyA']) {
      movement.sub(right);
    }

    if (movement.lengthSq() > 0) {
      movement.normalize();
      movement.multiplyScalar(MOVE_SPEED);
    }

    body.setLinvel(
      {
        x: movement.x,
        y: velocity.y,
        z: movement.z,
      },
      true
    );

    camera.position.set(
      position.x,
      position.y + 0.65,
      position.z
    );
  });

  const jump = () => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

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

  useEffect(() => {
    const handleJump = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        jump();
      }
    };

    window.addEventListener('keydown', handleJump);

    return () => {
      window.removeEventListener('keydown', handleJump);
    };
  }, []);

  return (
    <>
      <RigidBody
        ref={bodyRef}
        position={[0, 2, 6]}
        colliders={false}
        enabledRotations={[false, false, false]}
        friction={0}
      >
        <CapsuleCollider args={[0.6, 0.35]} />
      </RigidBody>

      <PointerLockControls />
    </>
  );
}