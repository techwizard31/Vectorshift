import { MotionConfig } from 'motion/react';
import { PipelineToolbar } from '../features/toolbar/PipelineToolbar';
import { PipelineCanvas } from '../features/canvas/PipelineCanvas';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <PipelineToolbar />
        <main className="workspace-main">
          <PipelineCanvas />
        </main>
      </div>
    </MotionConfig>
  );
}
