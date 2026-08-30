
import { RigidBody } from '@react-three/rapier';

type RoadProps = {
  position: [number, number, number];
  length?: number;
  width?: number;
  rotationY?: number;
};

export default function Road({
  position,
  length = 100,
  width = 12,
  rotationY = 0,
}: RoadProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        position={position}
        rotation={[0, rotationY, 0]}
        receiveShadow
      >
        <boxGeometry args={[width, 0.2, length]} />

        <meshStandardMaterial
          color="#202226"
          roughness={0.95}
        />
      </mesh>

      <mesh
        position={[
          position[0],
          position[1] + 0.11,
          position[2],
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          rotationY,
        ]}
      >
        <planeGeometry args={[0.15, length]} />

        <meshStandardMaterial
          color="#f0d84a"
          emissive="#554600"
          emissiveIntensity={0.15}
        />
      </mesh>
    </RigidBody>
  );
}