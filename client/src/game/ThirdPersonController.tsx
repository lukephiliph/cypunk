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
const NETWORK_UPDATE_INTERVAL = 100;

const CAMERA_DISTANCE = 6;
const CAMERA_HEIGHT = 2.6;
const MOUSE_SENSITIVITY = 0.0025;

type ThirdPersonControllerProps = {
  characterId: string;
  socket: WebSocket | null;
};

export default function ThirdPersonController({
  characterId,
  socket,
}: ThirdPersonControllerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const avatarRef = useRef<THREE.Group>(null);

  const keys = useRef<Record<string, boolean>>({});
  const lastNetworkUpdate = useRef(0);

  const yaw = useRef(0);
  const pitch = useRef(-0.15);

  const { camera, gl } = useThree();

  const [isMoving, setIsMoving] = useState(false);

  /*
   * --------------------------------------------------
   * KEYBOARD INPUT
   * --------------------------------------------------
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
   * --------------------------------------------------
   * MOUSE LOOK
   * --------------------------------------------------
   */

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) {
        return;
      }

      yaw.current -=
        event.movementX * MOUSE_SENSITIVITY;

      pitch.current -=
        event.movementY * MOUSE_SENSITIVITY;

      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        -0.65,
        0.45
      );
    };

    canvas.addEventListener('click', handleClick);

    document.addEventListener(
      'mousemove',
      handleMouseMove
    );

    return () => {
      canvas.removeEventListener('click', handleClick);

      document.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, [gl]);

  /*
   * --------------------------------------------------
   * JUMP
   * --------------------------------------------------
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

      const isGrounded =
        Math.abs(velocity.y) < 0.1;

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

    window.addEventListener(
      'keydown',
      handleJump
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleJump
      );
    };
  }, []);

  /*
   * --------------------------------------------------
   * GAME LOOP
   * --------------------------------------------------
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
     * CAMERA-RELATIVE DIRECTIONS
     * --------------------------------------------------
     */

    const forward = new THREE.Vector3(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current)
    );

    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current)
    );

    /*
     * --------------------------------------------------
     * PLAYER INPUT
     * --------------------------------------------------
     */

    const input = new THREE.Vector3();

    if (keys.current['KeyW']) {
      input.add(forward);
    }

    if (keys.current['KeyS']) {
      input.sub(forward);
    }

    if (keys.current['KeyA']) {
      input.sub(right);
    }

    if (keys.current['KeyD']) {
      input.add(right);
    }

    const moving =
      input.lengthSq() > 0;

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
       * Rotate visible avatar toward movement.
       */
      const targetRotation =
        Math.atan2(
          input.x,
          input.z
        );

      avatar.rotation.y =
        targetRotation;
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

    /*
     * --------------------------------------------------
     * MULTIPLAYER NETWORK UPDATE
     * --------------------------------------------------
     */

    const now =
      performance.now();

    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      now - lastNetworkUpdate.current >=
        NETWORK_UPDATE_INTERVAL
    ) {
      const currentPosition =
        body.translation();

      socket.send(
        JSON.stringify({
          type: 'player_move',

          character_id: characterId,

          position: {
            x: currentPosition.x,
            y: currentPosition.y,
            z: currentPosition.z,
          },

          rotation:
            avatar.rotation.y,
        })
      );

      lastNetworkUpdate.current =
        now;
    }

    /*
     * --------------------------------------------------
     * THIRD-PERSON CAMERA
     * --------------------------------------------------
     */

    const horizontalDistance =
      CAMERA_DISTANCE *
      Math.cos(pitch.current);

    const verticalDistance =
      CAMERA_DISTANCE *
      Math.sin(pitch.current);

    const desiredCameraPosition =
      new THREE.Vector3(
        position.x +
          Math.sin(yaw.current) *
            horizontalDistance,

        position.y +
          CAMERA_HEIGHT +
          verticalDistance,

        position.z +
          Math.cos(yaw.current) *
            horizontalDistance
      );

    /*
     * Smooth follow.
     */
    camera.position.lerp(
      desiredCameraPosition,
      0.15
    );

    /*
     * Keep player roughly center-screen.
     */
    camera.lookAt(
      position.x,
      position.y + 1.1,
      position.z
    );
  });

  /*
   * --------------------------------------------------
   * PLAYER
   * --------------------------------------------------
   */

  return (
    <RigidBody
      ref={bodyRef}
      position={[0, 2, 6]}
      colliders={false}
      enabledRotations={[
        false,
        false,
        false,
      ]}
      friction={0}
      linearDamping={0}
    >
      <CapsuleCollider
        args={[0.6, 0.35]}
      />

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