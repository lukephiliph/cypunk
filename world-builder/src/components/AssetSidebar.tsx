
import { useWorldStore } from '../store/worldStore';

export default function AssetSidebar() {
  const addObject =
    useWorldStore(
      (state) => state.addObject
    );

  return (
    <aside className="asset-sidebar">
      <h2>Assets</h2>

      <div className="asset-list">
        <button
          onClick={() =>
            addObject(
              'building',
              'Building'
            )
          }
        >
          Building
        </button>

        <button
          onClick={() =>
            addObject(
              'building',
              'Pub'
            )
          }
        >
          Pub
        </button>

        <button
          onClick={() =>
            addObject(
              'building',
              'Casino'
            )
          }
        >
          Casino
        </button>

        <button
          onClick={() =>
            addObject(
              'building',
              'Arena'
            )
          }
        >
          Arena
        </button>

        <button
          onClick={() =>
            addObject(
              'prop',
              'Street Light'
            )
          }
        >
          Street Light
        </button>

        <button
          onClick={() =>
            addObject(
              'prop',
              'Crate'
            )
          }
        >
          Crate
        </button>
      </div>
    </aside>
  );
}