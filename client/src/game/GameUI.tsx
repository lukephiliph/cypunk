import { useEffect, useState } from 'react';

import { getHealth } from '../api/backend';

type GameUIProps = {
  playerId: string;
};

export default function GameUI({
  playerId,
}: GameUIProps) {
  const [backendStatus, setBackendStatus] =
    useState('checking...');

  useEffect(() => {
    getHealth()
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus('offline');
      });
  }, []);

  return (
    <>
      <div className="instructions">
        WASD - Move
        <br />
        Space - Jump
      </div>

      <div className="backend-status">
        Server: {backendStatus}
        <br />
        Player: {playerId.slice(0, 8)}
      </div>
    </>
  );
}