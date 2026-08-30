
import { Canvas } from '@react-three/fiber';
import CyberdaneScene from './CyberdaneScene';

export default function Game() {
  return (
    <Canvas
      camera={{
        position: [8, 8, 12],
        fov: 60,
      }}
    >
      <CyberdaneScene />
    </Canvas>
  );
}