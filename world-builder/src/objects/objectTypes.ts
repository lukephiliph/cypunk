
export type WorldObjectType =
  | 'building'
  | 'prop'
  | 'light'
  | 'spawn';

export type WorldObject = {
  id: string;
  name: string;
  type: WorldObjectType;

  assetUrl?: string;

  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};