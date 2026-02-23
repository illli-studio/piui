import { useEffect, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { useCanvas } from './hooks/useCanvas';
import type { CanvasElement } from './types';
import type { Template } from './data/templates';

function App() {
  const {
    state,
    tool,
    setTool,
    setCanvasSize,
    addElement,
    addElements,
    updateElement,
    deleteElements,
    selectElement,
    clearSelection,
    setZoom,
    undo,
    redo,
    clearCanvas,
    loadTemplate,
    toggleVisibility,
    toggleLock,
    reorderElements,
    duplicateElements,
  } = useCanvas();

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleSizeSelect = useCallback((size: { width: number; height: number }) => {
    setCanvasSize(size.width, size.height);
  }, [setCanvasSize]);

  const handleTemplateSelect = useCallback((template: Template) => {
    setCanvasSize(template.canvasWidth, template.canvasHeight);
    loadTemplate(template.elements);
  }, [setCanvasSize, loadTemplate]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
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

  const handleAIGenerate = useCallback(async (prompt: string) => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation - in production, this would call the pi agent API
    setTimeout(() => {
      // Generate elements based on prompt
      const newElements: Omit<CanvasElement, 'id'>[] = [];
      
      // Background
      newElements.push({
        type: 'rectangle',
        x: 0,
        y: 0,
        width: state.canvasWidth,
        height: state.canvasHeight,
        rotation: 0,
        opacity: 1,
        fill: '#1a1a2e',
        stroke: '',
        strokeWidth: 0,
      });

      // Check prompt keywords
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes('youtube') || lowerPrompt.includes('thumbnail')) {
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 - 40,
          width: 600,
          height: 80,
          rotation: 0,
          opacity: 1,
          text: 'YOUR TITLE',
          fontSize: 56,
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: 'Outfit',
        });
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 + 40,
          width: 400,
          height: 36,
          rotation: 0,
          opacity: 0.8,
          text: 'Subscribe for more',
          fontSize: 24,
          fontWeight: 400,
          color: '#F97316',
          fontFamily: 'DM Sans',
        });
      } else if (lowerPrompt.includes('quote')) {
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 - 60,
          width: Math.min(700, state.canvasWidth - 80),
          height: 120,
          rotation: 0,
          opacity: 1,
          text: '"Your inspiring quote here"',
          fontSize: Math.min(36, state.canvasWidth / 30),
          fontWeight: 500,
          color: '#ffffff',
          fontFamily: 'DM Sans',
        });
      } else if (lowerPrompt.includes('sale') || lowerPrompt.includes('discount')) {
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 - 50,
          width: 600,
          height: 80,
          rotation: 0,
          opacity: 1,
          text: 'FLASH SALE',
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: 'Outfit',
        });
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 + 30,
          width: 400,
          height: 40,
          rotation: 0,
          opacity: 1,
          text: 'UP TO 50% OFF',
          fontSize: 32,
          fontWeight: 600,
          color: '#FBBF24',
          fontFamily: 'Outfit',
        });
      } else {
        // Default modern cover
        newElements.push({
          type: 'text',
          x: state.canvasWidth / 2,
          y: state.canvasHeight / 2 - 20,
          width: 500,
          height: 60,
          rotation: 0,
          opacity: 1,
          text: 'PiUI Generated',
          fontSize: 48,
          fontWeight: 600,
          color: '#ffffff',
          fontFamily: 'Outfit',
        });
      }

      // Add decorative circle accent
      newElements.push({
        type: 'circle',
        x: state.canvasWidth - 150,
        y: 80,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 0.8,
        fill: '#F97316',
        stroke: '',
        strokeWidth: 0,
      });

      addElements(newElements);
      setIsGeneratingAI(false);
    }, 1500);
  }, [state.canvasWidth, state.canvasHeight, addElements]);

  const [exportFormat] = useState<'png' | 'jpg'>('png');

  const handleExport = useCallback((format?: 'png' | 'jpg') => {
    const exportFmt = format || exportFormat;
    const canvas = document.createElement('canvas');
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill with white background
      ctx.fillStyle = exportFmt === 'jpg' ? '#ffffff' : 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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
          ctx.textAlign = element.textAlign || 'left';
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
      
      const link = document.createElement('a');
      link.download = `piui-cover.${exportFmt}`;
      link.href = canvas.toDataURL(`image/${exportFmt}`, exportFmt === 'jpg' ? 0.92 : 1.0);
      link.click();
    }
  }, [state, exportFormat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      } 
      // Redo
      else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        redo();
      } 
      // Delete
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedIds.length > 0) {
          deleteElements(state.selectedIds);
        }
      }
      // Copy (Ctrl+C)
      else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        if (state.selectedIds.length > 0) {
          e.preventDefault();
          const selectedElements = state.elements.filter((el: CanvasElement) => state.selectedIds.includes(el.id));
          localStorage.setItem('piui_clipboard', JSON.stringify(selectedElements));
        }
      }
      // Paste (Ctrl+V)
      else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const clipboard = localStorage.getItem('piui_clipboard');
        if (clipboard) {
          try {
            const elements = JSON.parse(clipboard);
            const newElements = elements.map((el: CanvasElement) => ({
              ...el,
              id: uuidv4(),
              x: el.x + 20,
              y: el.y + 20,
            }));
            addElements(newElements);
          } catch (err) {
            console.error('Failed to paste:', err);
          }
        }
      }
      // Duplicate (Ctrl+D)
      else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        if (state.selectedIds.length > 0) {
          e.preventDefault();
          duplicateElements(state.selectedIds);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, state.selectedIds, state.elements, deleteElements, duplicateElements, addElements]);

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
          onTemplateSelect={handleTemplateSelect}
          onClearCanvas={clearCanvas}
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
          onDelete={deleteElements}
          onAIGenerate={handleAIGenerate}
          isGeneratingAI={isGeneratingAI}
        />
        <LayersPanel
          elements={state.elements}
          selectedIds={state.selectedIds}
          onSelect={selectElement}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
          onReorder={reorderElements}
          onDelete={(id) => deleteElements([id])}
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
