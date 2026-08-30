import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';

import CyberdaneScene from './CyberdaneScene';
import PlayerController from './PlayerController';
import GameUI from './GameUI';

export default function Game() {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 1.7, 6],
          fov: 70,
        }}
      >
        <Physics gravity={[0, -20, 0]}>
          <CyberdaneScene />
          <PlayerController />
        </Physics>
      </Canvas>

      <GameUI />
    </>
  );
}