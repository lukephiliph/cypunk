import { useEffect, useState } from 'react';

import { getHealth } from '../api/backend';

export default function GameUI() {
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
        Cyberdane server: {backendStatus}
      </div>
    </>
  );
}