
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { useMemo } from 'react';

type Props = {
  model: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export default function WorldBuilding({
  model,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: Props) {
  const { scene } = useGLTF(model);

  const clonedScene = useMemo(
    () => clone(scene),
    [scene]
  );

  return (
    <RigidBody
      type="fixed"
      colliders="trimesh"
    >
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </RigidBody>
  );
}