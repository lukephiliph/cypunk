
import { Canvas } from '@react-three/fiber';

import AssetSidebar from '../components/AssetSidebar';
import Inspector from '../components/Inspector';

import EditorScene from './EditorScene';

export default function WorldEditor() {
  return (
    <div className="world-editor">
      <header className="topbar">
        <div>
          <strong>
            CYBERDANE
          </strong>

          <span>
            World Builder
          </span>
        </div>

        <div className="topbar-actions">
          <button>Save</button>
          <button>Publish</button>
        </div>
      </header>

      <AssetSidebar />

      <main className="editor-canvas">
        <Canvas
          shadows
          camera={{
            position: [
              12,
              12,
              12,
            ],

            fov: 55,

            near: 0.1,
            far: 1000,
          }}
        >
          <EditorScene />
        </Canvas>
      </main>

      <Inspector />

      <footer className="statusbar">
        Cyberdane World Editor
      </footer>
    </div>
  );
}