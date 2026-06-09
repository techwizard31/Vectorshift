import React from 'react';
import { PipelineToolbar } from './toolbar.tsx';
import { PipelineUI } from './ui.tsx';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-neutral-50">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;