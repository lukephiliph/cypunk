
import { OrbitControls } from '@react-three/drei';

export default function CyberdaneScene() {
  return (
    <>
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
      />

      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      <mesh position={[-5, 2, -4]}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      <mesh position={[5, 3, -4]}>
        <boxGeometry args={[4, 7, 3]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>

      <OrbitControls />
    </>
  );
}