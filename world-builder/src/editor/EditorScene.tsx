
import {
  Grid,
  OrbitControls,
} from '@react-three/drei';

import { useWorldStore } from '../store/worldStore';

import WorldObject from '../objects/WorldObject';

export default function EditorScene() {
  const objects =
    useWorldStore(
      (state) => state.objects
    );

  const selectObject =
    useWorldStore(
      (state) =>
        state.selectObject
    );

  return (
    <>
      <color
        attach="background"
        args={['#08090d']}
      />

      <ambientLight intensity={0.8} />

      <directionalLight
        position={[20, 30, 10]}
        intensity={2}
        castShadow
      />

      <Grid
        args={[500, 500]}
        cellSize={1}
        cellThickness={0.5}
        sectionSize={10}
        sectionThickness={1}
        fadeDistance={250}
        infiniteGrid
      />

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[0, -0.01, 0]}
        onClick={() =>
          selectObject(null)
        }
        receiveShadow
      >
        <planeGeometry
          args={[500, 500]}
        />

        <meshStandardMaterial
          color="#111319"
        />
      </mesh>

      {objects.map((object) => (
        <WorldObject
          key={object.id}
          object={object}
        />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxDistance={250}
        minDistance={2}
      />
    </>
  );
}