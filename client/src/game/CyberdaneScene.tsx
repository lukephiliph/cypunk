import { CuboidCollider, RigidBody } from '@react-three/rapier';

export default function CyberdaneScene() {
  return (
    <>
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
      />

      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[40, 1, 40]} />
          <meshStandardMaterial color="#242424" />
        </mesh>

        <CuboidCollider
          args={[20, 0.5, 20]}
          position={[0, -0.5, 0]}
        />
      </RigidBody>

      {/* Center block */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1, -5]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      </RigidBody>

      {/* Building 1 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-6, 2.5, -8]}>
          <boxGeometry args={[4, 5, 4]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </RigidBody>

      {/* Building 2 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[6, 4, -8]}>
          <boxGeometry args={[5, 8, 4]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </RigidBody>

      {/* Small structure */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[5, 1, 3]}>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      </RigidBody>

      <gridHelper args={[40, 40]} />
    </>
  );
}