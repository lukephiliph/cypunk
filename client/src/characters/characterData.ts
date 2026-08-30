
export type CharacterDefinition = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export const characters: CharacterDefinition[] = [
  {
    id: 'mara',
    name: 'Mara',
    color: '#7c3aed',
    description: 'Calm, adaptable, observant.',
  },
  {
    id: 'zero',
    name: 'Zero',
    color: '#0ea5e9',
    description: 'Fast, sharp, unpredictable.',
  },
  {
    id: 'nova',
    name: 'Nova',
    color: '#ef4444',
    description: 'Bold, social, confrontational.',
  },
];