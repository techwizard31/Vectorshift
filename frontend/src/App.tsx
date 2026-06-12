import React from 'react';
import { PipelineToolbar } from './toolbar.tsx';
import { PipelineUI } from './ui.tsx';

function App() {
  return (
    <div className="app-shell">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;