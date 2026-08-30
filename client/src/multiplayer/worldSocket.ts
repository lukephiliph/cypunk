export type WorldMessage =
  | {
      type: 'player_join';
      player_id: string;
    }
  | {
      type: 'player_leave';
      player_id: string;
    }
  | {
      type: 'player_move';
      player_id: string;
      position: {
        x: number;
        y: number;
        z: number;
      };
      rotation: number;
    };

export function connectToWorld(
  playerId: string,
  onMessage: (message: WorldMessage) => void
): WebSocket {
  const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/world/${playerId}`
  );

  socket.onopen = () => {
    console.log(
      'Connected to Cyberdane:',
      playerId
    );
  };

  socket.onmessage = (event) => {
    try {
      const message: WorldMessage =
        JSON.parse(event.data);

      onMessage(message);
    } catch (error) {
      console.error(
        'Invalid WebSocket message:',
        error
      );
    }
  };

  socket.onclose = () => {
    console.log(
      'Disconnected from Cyberdane'
    );
  };

  socket.onerror = (error) => {
    console.error(
      'Cyberdane WebSocket error:',
      error
    );
  };

  return socket;
}