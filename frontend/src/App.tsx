import React from 'react';
import { MotionConfig } from 'motion/react';
import { PipelineToolbar } from './toolbar.tsx';
import { PipelineUI } from './ui.tsx';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <PipelineToolbar />
        <main className="workspace-main">
          <PipelineUI />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
