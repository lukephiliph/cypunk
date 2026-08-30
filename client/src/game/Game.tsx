import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';

import CyberdaneScene from './CyberdaneScene';
import ThirdPersonController from './ThirdPersonController';
import GameUI from './GameUI';

type GameProps = {
  characterId: string;
  playerId: string;
};

export default function Game({
  characterId,
  playerId,
}: GameProps) {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 5, 10],
          fov: 60,
        }}
      >
        <Physics gravity={[0, -20, 0]}>
          <CyberdaneScene />

          <ThirdPersonController
            characterId={characterId}
          />
        </Physics>
      </Canvas>

      <GameUI playerId={playerId} />
    </>
  );
}