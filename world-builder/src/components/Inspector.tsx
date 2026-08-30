
import { useWorldStore } from '../store/worldStore';

export default function Inspector() {
  const objects =
    useWorldStore(
      (state) => state.objects
    );

  const selectedObjectId =
    useWorldStore(
      (state) =>
        state.selectedObjectId
    );

  const deleteSelectedObject =
    useWorldStore(
      (state) =>
        state.deleteSelectedObject
    );

  const selectedObject =
    objects.find(
      (object) =>
        object.id ===
        selectedObjectId
    );

  return (
    <aside className="inspector">
      <h2>Inspector</h2>

      {!selectedObject && (
        <p className="empty-message">
          Select an object
        </p>
      )}

      {selectedObject && (
        <>
          <div className="property">
            <label>Name</label>

            <span>
              {selectedObject.name}
            </span>
          </div>

          <div className="property">
            <label>Type</label>

            <span>
              {selectedObject.type}
            </span>
          </div>

          <div className="property">
            <label>Position</label>

            <span>
              X {selectedObject.position[0]}
            </span>

            <span>
              Y {selectedObject.position[1]}
            </span>

            <span>
              Z {selectedObject.position[2]}
            </span>
          </div>

          <div className="property">
            <label>Rotation</label>

            <span>
              X {selectedObject.rotation[0]}
            </span>

            <span>
              Y {selectedObject.rotation[1]}
            </span>

            <span>
              Z {selectedObject.rotation[2]}
            </span>
          </div>

          <button
            className="delete-button"
            onClick={
              deleteSelectedObject
            }
          >
            Delete Object
          </button>
        </>
      )}
    </aside>
  );
}