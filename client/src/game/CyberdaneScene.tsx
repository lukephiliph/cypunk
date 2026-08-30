import {
  CuboidCollider,
  RigidBody,
} from '@react-three/rapier';

import * as THREE from 'three';
import Road from '../world/infrastructure/Road';
import WorldBuilding from '../world/buildings/WorldBuilding';
const WORLD_SIZE = 300;


/*
 * --------------------------------------------------
 * BUILDINGS
 * --------------------------------------------------
 */

type BuildingData = {
  id: string;
  x: number;
  z: number;

  width: number;
  height: number;
  depth: number;

  color: string;
};

const buildings: BuildingData[] = [];


/*
 * Generate deterministic city blocks.
 *
 * We deliberately leave roads around
 * x=0 and z=0.
 */
for (let x = -120; x <= 120; x += 30) {
  for (let z = -120; z <= 120; z += 30) {
    /*
     * Main cross roads.
     */
    if (
      Math.abs(x) < 18 ||
      Math.abs(z) < 18
    ) {
      continue;
    }

    const seed =
      Math.abs(x * 13 + z * 17);

    const height =
      8 + (seed % 30);

    const width =
      12 + (seed % 8);

    const depth =
      12 + ((seed * 3) % 8);

    const colors = [
      '#17171c',
      '#202027',
      '#27272f',
      '#181820',
      '#24242c',
    ];

    buildings.push({
      id: `building-${x}-${z}`,

      x,
      z,

      width,
      depth,
      height,

      color:
        colors[
          seed % colors.length
        ],
    });
  }
}


/*
 * --------------------------------------------------
 * BUILDING
 * --------------------------------------------------
 */

function Building({
  building,
}: {
  building: BuildingData;
}) {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
    >
      {/* Main building */}

      <mesh
        position={[
          building.x,
          building.height / 2,
          building.z,
        ]}
      >
        <boxGeometry
          args={[
            building.width,
            building.height,
            building.depth,
          ]}
        />

        <meshStandardMaterial
          color={building.color}
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>

      <CuboidCollider
        args={[
          building.width / 2,
          building.height / 2,
          building.depth / 2,
        ]}
        position={[
          building.x,
          building.height / 2,
          building.z,
        ]}
      />

      {/* Rooftop neon strip */}

      <mesh
        position={[
          building.x,
          building.height + 0.15,
          building.z,
        ]}
      >
        <boxGeometry
          args={[
            building.width * 0.8,
            0.15,
            0.15,
          ]}
        />

        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={4}
        />
      </mesh>
    </RigidBody>
  );
}


/*
 * --------------------------------------------------
 * STREET LIGHT
 * --------------------------------------------------
 */

function StreetLight({
  x,
  z,
}: {
  x: number;
  z: number;
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Pole */}

      <mesh position={[0, 2, 0]}>
        <cylinderGeometry
          args={[0.08, 0.1, 4, 8]}
        />

        <meshStandardMaterial
          color="#34343d"
          metalness={0.8}
        />
      </mesh>

      {/* Light */}

      <mesh position={[0, 4.1, 0]}>
        <sphereGeometry
          args={[0.15, 12, 12]}
        />

        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={6}
        />
      </mesh>

      <pointLight
        position={[0, 4, 0]}
        intensity={8}
        distance={14}
        decay={2}
        color="#00e5ff"
      />
    </group>
  );
}


/*
 * --------------------------------------------------
 * CENTRAL TOWER
 * --------------------------------------------------
 */

function CyberdaneTower() {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
    >
      <mesh
        position={[0, 30, -45]}
      >
        <boxGeometry
          args={[22, 60, 22]}
        />

        <meshStandardMaterial
          color="#101017"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      <CuboidCollider
        args={[11, 30, 11]}
        position={[0, 30, -45]}
      />

      {/* Tower neon core */}

      <mesh
        position={[0, 32, -33.8]}
      >
        <boxGeometry
          args={[5, 38, 0.2]}
        />

        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={5}
        />
      </mesh>

      {/* Antenna */}

      <mesh
        position={[0, 67, -45]}
      >
        <cylinderGeometry
          args={[0.2, 0.5, 14, 8]}
        />

        <meshStandardMaterial
          color="#555"
          metalness={1}
        />
      </mesh>

      <pointLight
        position={[0, 64, -45]}
        intensity={40}
        distance={50}
        color="#8b5cf6"
      />
    </RigidBody>
  );
}


/*
 * --------------------------------------------------
 * CENTRAL PLAZA
 * --------------------------------------------------
 */

function CentralPlaza() {
  return (
    <group>
      <mesh
        position={[0, 0.03, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <circleGeometry
          args={[18, 64]}
        />

        <meshStandardMaterial
          color="#18181f"
          roughness={0.45}
          metalness={0.3}
        />
      </mesh>

      {/* Glowing plaza ring */}

      <mesh
        position={[0, 0.06, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <ringGeometry
          args={[14, 14.3, 64]}
        />

        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central monument */}

      <RigidBody
        type="fixed"
        colliders="cuboid"
      >
        <mesh
          position={[0, 3, 0]}
        >
          <boxGeometry
            args={[3, 6, 3]}
          />

          <meshStandardMaterial
            color="#15151b"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </RigidBody>

      <pointLight
        position={[0, 6, 0]}
        intensity={25}
        distance={30}
        color="#8b5cf6"
      />
    </group>
  );
}


/*
 * --------------------------------------------------
 * INDUSTRIAL DISTRICT
 * --------------------------------------------------
 */

function IndustrialDistrict() {
  return (
    <group>
      {[-100, -80, -60].map(
        (x, index) => (
          <RigidBody
            key={x}
            type="fixed"
            colliders="cuboid"
          >
            <mesh
              position={[
                x,
                5,
                80,
              ]}
            >
              <cylinderGeometry
                args={[
                  5,
                  5,
                  10 +
                    index * 3,
                  16,
                ]}
              />

              <meshStandardMaterial
                color="#292930"
                metalness={0.7}
                roughness={0.5}
              />
            </mesh>
          </RigidBody>
        )
      )}

      <pointLight
        position={[-80, 12, 80]}
        intensity={30}
        distance={45}
        color="#ff5522"
      />
    </group>
  );
}


/*
 * --------------------------------------------------
 * WORLD BOUNDARIES
 * --------------------------------------------------
 */

function WorldBoundaries() {
  const half =
    WORLD_SIZE / 2;

  const height = 10;
  const thickness = 2;

  return (
    <>
      <RigidBody
        type="fixed"
        colliders="cuboid"
      >
        <mesh
          position={[
            0,
            height / 2,
            -half,
          ]}
        >
          <boxGeometry
            args={[
              WORLD_SIZE,
              height,
              thickness,
            ]}
          />

          <meshStandardMaterial
            color="#111116"
          />
        </mesh>
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders="cuboid"
      >
        <mesh
          position={[
            0,
            height / 2,
            half,
          ]}
        >
          <boxGeometry
            args={[
              WORLD_SIZE,
              height,
              thickness,
            ]}
          />

          <meshStandardMaterial
            color="#111116"
          />
        </mesh>
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders="cuboid"
      >
        <mesh
          position={[
            -half,
            height / 2,
            0,
          ]}
        >
          <boxGeometry
            args={[
              thickness,
              height,
              WORLD_SIZE,
            ]}
          />

          <meshStandardMaterial
            color="#111116"
          />
        </mesh>
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders="cuboid"
      >
        <mesh
          position={[
            half,
            height / 2,
            0,
          ]}
        >
          <boxGeometry
            args={[
              thickness,
              height,
              WORLD_SIZE,
            ]}
          />

          <meshStandardMaterial
            color="#111116"
          />
        </mesh>
      </RigidBody>
    </>
  );
}


/*
 * --------------------------------------------------
 * CYBERDANE
 * --------------------------------------------------
 */

export default function CyberdaneScene() {
  return (
    <>
      {/*
       * --------------------------------------------------
       * ATMOSPHERE
       * --------------------------------------------------
       */}

      <color
        attach="background"
        args={['#040408']}
      />

      <fog
        attach="fog"
        args={[
          '#040408',
          60,
          240,
        ]}
      />

      {/*
       * --------------------------------------------------
       * LIGHTING
       * --------------------------------------------------
       */}

      <ambientLight
        intensity={0.35}
      />

      <hemisphereLight
        args={[
          '#39405f',
          '#050507',
          0.7,
        ]}
      />

      <directionalLight
        position={[60, 100, 40]}
        intensity={1.2}
        castShadow
      />

      {/*
       * --------------------------------------------------
       * WORLD GROUND
       * --------------------------------------------------
       */}

      <RigidBody
        type="fixed"
        colliders={false}
      >
        <mesh
          position={[0, -0.5, 0]}
          receiveShadow
        >
          <boxGeometry
            args={[
              WORLD_SIZE,
              1,
              WORLD_SIZE,
            ]}
          />

          <meshStandardMaterial
            color="#0d0d12"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        <CuboidCollider
          args={[
            WORLD_SIZE / 2,
            0.5,
            WORLD_SIZE / 2,
          ]}
          position={[0, -0.5, 0]}
        />
      </RigidBody>

      {/*
       * --------------------------------------------------
       * MAIN ROADS
       * --------------------------------------------------
       */}

      <Road
        position={[0, 0.05, 0]}
        length={WORLD_SIZE}
        width={18}
      />

      <Road
        position={[0, 0.06, 0]}
        length={WORLD_SIZE}
        width={18}
        rotationY={Math.PI / 2}
      />

      {/*
       * --------------------------------------------------
       * ROAD NEON LINES
       * --------------------------------------------------
       */}

      <mesh
        position={[
          -5,
          0.04,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            0.15,
            WORLD_SIZE,
          ]}
        />

        <meshBasicMaterial
          color="#00d9ff"
        />
      </mesh>

      <mesh
        position={[
          5,
          0.04,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={[
            0.15,
            WORLD_SIZE,
          ]}
        />

        <meshBasicMaterial
          color="#ff2079"
        />
      </mesh>

      {/*
       * --------------------------------------------------
       * CITY
       * --------------------------------------------------
       */}

      {/* {buildings.map(
        (building) => (
          <Building
            key={building.id}
            building={building}
          />
        )
      )} */}

      {/*
       * --------------------------------------------------
       * LANDMARKS
       * --------------------------------------------------
       */}

    <WorldBuilding
        model="/models/world/downtown/Building_Small_1.gltf"
        position={[30, 0, 30]}
        rotation={[0, Math.PI, 0]}
        scale={1}
        />

      <CentralPlaza />

      <CyberdaneTower />

      <IndustrialDistrict />

      {/*
       * --------------------------------------------------
       * STREET LIGHTS
       * --------------------------------------------------
       */}

      {Array.from({
        length: 13,
      }).map((_, index) => {
        const z =
          -120 + index * 20;

        return (
          <group key={z}>
            <StreetLight
              x={-8}
              z={z}
            />

            <StreetLight
              x={8}
              z={z}
            />
          </group>
        );
      })}

      {/*
       * Horizontal road lights
       */}

      {Array.from({
        length: 13,
      }).map((_, index) => {
        const x =
          -120 + index * 20;

        return (
          <group
            key={`horizontal-${x}`}
          >
            <StreetLight
              x={x}
              z={-8}
            />

            <StreetLight
              x={x}
              z={8}
            />
          </group>
        );
      })}

      {/*
       * --------------------------------------------------
       * WORLD BOUNDARIES
       * --------------------------------------------------
       */}

      <WorldBoundaries />

      {/*
       * Grid is intentionally subtle now.
       */}

      <gridHelper
        args={[
          WORLD_SIZE,
          150,
          '#252530',
          '#15151c',
        ]}
        position={[0, 0.03, 0]}
      />
    </>
  );
}