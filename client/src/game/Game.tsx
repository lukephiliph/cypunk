import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';

import CyberdaneScene from './CyberdaneScene';
import ThirdPersonController from './ThirdPersonController';
import GameUI from './GameUI';

import RemotePlayer from '../multiplayer/RemotePlayer';

import { connectToWorld } from '../multiplayer/worldSocket';
import type { WorldMessage } from '../multiplayer/worldSocket';

type GameProps = {
  characterId: string;
  playerId: string;
};

type RemotePlayerState = {
  playerId: string;

  position: {
    x: number;
    y: number;
    z: number;
  };

  rotation: number;
};

export default function Game({
  characterId,
  playerId,
}: GameProps) {
  const socketRef = useRef<WebSocket | null>(null);

  const [socket, setSocket] =
    useState<WebSocket | null>(null);

  const [remotePlayers, setRemotePlayers] =
    useState<Record<string, RemotePlayerState>>({});

  useEffect(() => {
    const worldSocket = connectToWorld(
      playerId,

      (message: WorldMessage) => {
        console.log('World message:', message);

        if (message.type === 'player_join') {
          setRemotePlayers((players) => ({
            ...players,

            [message.player_id]: {
              playerId: message.player_id,

              position: {
                x: 0,
                y: 2,
                z: 6,
              },

              rotation: 0,
            },
          }));
        }

        if (message.type === 'player_move') {
          setRemotePlayers((players) => ({
            ...players,

            [message.player_id]: {
              playerId: message.player_id,

              position: message.position,

              rotation: message.rotation,
            },
          }));
        }

        if (message.type === 'player_leave') {
          setRemotePlayers((players) => {
            const updated = {
              ...players,
            };

            delete updated[message.player_id];

            return updated;
          });
        }
      }
    );

    socketRef.current = worldSocket;

    setSocket(worldSocket);

    return () => {
      worldSocket.close();

      socketRef.current = null;

      setSocket(null);
    };
  }, [playerId]);

  return (
    <>
      <Canvas
  shadows
  camera={{
    position: [0, 5, 10],
    fov: 60,
    near: 0.1,
    far: 500,
  }}
>
        <Physics gravity={[0, -20, 0]}>
          <CyberdaneScene />

          <ThirdPersonController
            characterId={characterId}
            socket={socket}
          />

          {Object.values(remotePlayers).map(
            (player) => (
              <RemotePlayer
                key={player.playerId}
                position={player.position}
                rotation={player.rotation}
              />
            )
          )}
        </Physics>
      </Canvas>

      <GameUI playerId={playerId} />
    </>
  );
}