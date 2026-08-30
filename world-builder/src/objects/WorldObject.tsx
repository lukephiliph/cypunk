
import type {
  WorldObject as WorldObjectData,
} from './objectTypes';

import { useWorldStore } from '../store/worldStore';

type Props = {
  object: WorldObjectData;
};

export default function WorldObject({
  object,
}: Props) {
  const selectedObjectId =
    useWorldStore(
      (state) =>
        state.selectedObjectId
    );

  const selectObject =
    useWorldStore(
      (state) =>
        state.selectObject
    );

  const isSelected =
    selectedObjectId === object.id;

  return (
    <mesh
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={(event) => {
        event.stopPropagation();

        selectObject(object.id);
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />

      <meshStandardMaterial
        color={
          isSelected
            ? '#00ffff'
            : '#555866'
        }
      />
    </mesh>
  );
}