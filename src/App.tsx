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

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Scale image to fit within 400x400 while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxSize = 400;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = width * ratio;
          height = height * ratio;
        }

        addElement({
          type: 'image',
          x: (state.canvasWidth - width) / 2,
          y: (state.canvasHeight - height) / 2,
          width,
          height,
          rotation: 0,
          opacity: 1,
          src,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [addElement, state.canvasWidth, state.canvasHeight]);

  const handleExport = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw elements
      state.elements.forEach((element) => {
        ctx.save();
        ctx.globalAlpha = element.opacity;
        
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        
        if (element.type === 'text') {
          ctx.font = `${element.fontWeight || 400} ${element.fontSize || 24}px ${element.fontFamily || 'DM Sans'}`;
          ctx.fillStyle = element.color || '#000000';
          ctx.textBaseline = 'top';
          ctx.fillText(element.text || '', element.x, element.y);
        } else if (element.type === 'rectangle') {
          ctx.fillStyle = element.fill || '#3B82F6';
          ctx.fillRect(element.x, element.y, element.width, element.height);
          if (element.strokeWidth) {
            ctx.strokeStyle = element.stroke || '#000000';
            ctx.lineWidth = element.strokeWidth;
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
        } else if (element.type === 'circle') {
          ctx.fillStyle = element.fill || '#EF4444';
          ctx.beginPath();
          ctx.ellipse(
            element.x + element.width / 2,
            element.y + element.height / 2,
            element.width / 2,
            element.height / 2,
            0, 0, Math.PI * 2
          );
          ctx.fill();
          if (element.strokeWidth) {
            ctx.strokeStyle = element.stroke || '#000000';
            ctx.lineWidth = element.strokeWidth;
            ctx.stroke();
          }
        } else if (element.type === 'image' && element.src) {
          const img = new Image();
          img.src = element.src;
          ctx.drawImage(img, element.x, element.y, element.width, element.height);
        }
        
        ctx.restore();
      });
      
      // Download
      const link = document.createElement('a');
      link.download = 'piui-cover.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, [state]);

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
          onImageUpload={handleImageUpload}
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
