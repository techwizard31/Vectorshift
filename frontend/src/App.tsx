import React from 'react';
import { PipelineToolbar } from './toolbar.tsx';
import { PipelineUI } from './ui.tsx';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;