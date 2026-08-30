const API_URL = 'http://127.0.0.1:8000';

export type HealthResponse = {
  status: string;
  world: string;
};

export type JoinPlayerResponse = {
  player_id: string;
  character_id: string;
  world: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend request failed');
  }

  return response.json();
}

export async function joinWorld(
  characterId: string
): Promise<JoinPlayerResponse> {
  const response = await fetch(`${API_URL}/players/join`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      character_id: characterId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to join Cyberdane');
  }

  return response.json();
}