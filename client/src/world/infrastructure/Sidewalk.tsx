
import { RigidBody } from '@react-three/rapier';

type SidewalkProps = {
  position: [number, number, number];
  length?: number;
  width?: number;
};

export default function Sidewalk({
  position,
  length = 100,
  width = 3,
}: SidewalkProps) {
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
    >
      <mesh
        position={position}
        receiveShadow
      >
        <boxGeometry
          args={[
            width,
            0.3,
            length,
          ]}
        />

        <meshStandardMaterial
          color="#72747a"
          roughness={1}
        />
      </mesh>
    </RigidBody>
  );
}