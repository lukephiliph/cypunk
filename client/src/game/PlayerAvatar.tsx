type PlayerAvatarProps = {
  position: [number, number, number];
};

export default function PlayerAvatar({ position }: PlayerAvatarProps) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
    </group>
  );
}