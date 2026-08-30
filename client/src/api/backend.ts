const API_URL = 'http://127.0.0.1:8000';

export type HealthResponse = {
  status: string;
  world: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend request failed');
  }

  return response.json();
}
