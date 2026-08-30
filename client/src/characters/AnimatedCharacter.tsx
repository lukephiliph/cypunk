import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type AnimatedCharacterProps = {
  moving: boolean;
};

export default function AnimatedCharacter({
  moving,
}: AnimatedCharacterProps) {
  const group = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF('/models/character-d.glb');

  const { actions } = useAnimations(
    animations,
    group
  );

  useEffect(() => {
    const idle =
      actions['Idle'] ??
      actions['idle'];

    const walk =
      actions['Walk'] ??
      actions['Walking'] ??
      actions['walk'];

    if (moving) {
      idle?.fadeOut(0.2);

      walk
        ?.reset()
        .fadeIn(0.2)
        .play();
    } else {
      walk?.fadeOut(0.2);

      idle
        ?.reset()
        .fadeIn(0.2)
        .play();
    }

    return () => {
      idle?.stop();
      walk?.stop();
    };
  }, [moving, actions]);

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1}
      />
    </group>
  );
}

useGLTF.preload('/models/character-d.glb');