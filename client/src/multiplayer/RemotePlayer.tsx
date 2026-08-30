import AnimatedCharacter from '../characters/AnimatedCharacter';

type RemotePlayerProps = {
  position: {
    x: number;
    y: number;
    z: number;
  };

  rotation: number;
};

export default function RemotePlayer({
  position,
  rotation,
}: RemotePlayerProps) {
  return (
    <group
      position={[
        position.x,
        position.y,
        position.z,
      ]}
      rotation={[0, rotation, 0]}
    >
      <AnimatedCharacter moving={false} />
    </group>
  );
}