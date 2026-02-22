import { useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useCanvas } from './hooks/useCanvas';
import type { CanvasSize, CanvasElement } from './types';

function App() {
  const {
    state,
    tool,
    setTool,
    setCanvasSize,
    addElement,
    updateElement,
    deleteElements,
    selectElement,
    clearSelection,
    setZoom,
    undo,
    redo,
  } = useCanvas();

  const handleSizeSelect = useCallback((size: CanvasSize) => {
    setCanvasSize(size.width, size.height);
  }, [setCanvasSize]);

  const handleExport = useCallback(() => {
    alert('Export functionality coming soon!');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedIds.length > 0) {
          deleteElements(state.selectedIds);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, state.selectedIds, deleteElements]);

  const selectedElements = state.elements.filter((el: CanvasElement) => state.selectedIds.includes(el.id));

  return (
    <div className="app">
      <Header
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
      />
      <main className="main">
        <Sidebar
          currentSize={{ width: state.canvasWidth, height: state.canvasHeight }}
          onSizeSelect={handleSizeSelect}
          onToolSelect={(t) => setTool(t as typeof tool)}
          currentTool={tool}
        />
        <Canvas
          width={state.canvasWidth}
          height={state.canvasHeight}
          elements={state.elements}
          selectedIds={state.selectedIds}
          zoom={state.zoom}
          tool={tool}
          onSelect={selectElement}
          onClearSelection={clearSelection}
          onAddElement={addElement}
          onUpdateElement={updateElement}
        />
        <PropertiesPanel
          selectedElements={selectedElements}
          onUpdate={updateElement}
        />
      </main>
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => setZoom(state.zoom - 0.1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="zoom-value">{Math.round(state.zoom * 100)}%</span>
        <button className="zoom-btn" onClick={() => setZoom(state.zoom + 0.1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button className="zoom-btn" onClick={() => setZoom(0.5)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
