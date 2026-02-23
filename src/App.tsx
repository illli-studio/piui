import { useEffect, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { ProjectManager } from './components/ProjectManager';
import { useCanvas } from './hooks/useCanvas';
import { generateCoverWithAI } from './services/aiService';
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
  const [showProjectManager, setShowProjectManager] = useState(false);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (state.elements.length > 0) {
        const autoSaveData = {
          width: state.canvasWidth,
          height: state.canvasHeight,
          elements: state.elements,
          zoom: state.zoom,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('piui_autosave', JSON.stringify(autoSaveData));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [state]);

  // Load autosave on mount
  useEffect(() => {
    const autoSaveData = localStorage.getItem('piui_autosave');
    if (autoSaveData && state.elements.length === 0) {
      try {
        const data = JSON.parse(autoSaveData);
        if (confirm('Found unsaved work. Would you like to restore it?')) {
          setCanvasSize(data.width, data.height);
          setZoom(data.zoom || 0.5);
          data.elements.forEach((el: any) => addElement({ ...el, id: uuidv4() }));
        }
      } catch (e) {
        console.error('Failed to load autosave:', e);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    const name = prompt('Enter project name:', `Project ${new Date().toLocaleDateString()}`);
    if (name) {
      const projectData = {
        name,
        width: state.canvasWidth,
        height: state.canvasHeight,
        elements: state.elements,
        savedAt: new Date().toISOString(),
      };
      
      const existing = JSON.parse(localStorage.getItem('piui_projects') || '[]');
      existing.push(projectData);
      localStorage.setItem('piui_projects', JSON.stringify(existing));
      alert('Project saved!');
    }
  }, [state]);

  const handleLoadProject = useCallback((project: any) => {
    setCanvasSize(project.width, project.height);
    const newElements = project.elements.map((el: any) => ({ ...el, id: uuidv4() }));
    clearCanvas();
    newElements.forEach((el: any) => addElement(el));
  }, [setCanvasSize, clearCanvas, addElement]);

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
    
    try {
      // Call AI service to generate cover
      const result = await generateCoverWithAI(
        prompt, 
        state.canvasWidth, 
        state.canvasHeight
      );
      
      // Convert AI elements to canvas elements
      const newElements = result.elements.map((el) => ({
        ...el,
        id: uuidv4(),
      })) as Omit<CanvasElement, 'id'>[];
      
      addElements(newElements);
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  }, [state.canvasWidth, state.canvasHeight, addElements]);

  const [exportFormat] = useState<'png' | 'jpg' | 'svg'>('png');

  const handleExport = useCallback((format?: 'png' | 'jpg' | 'svg') => {
    const exportFmt = format || exportFormat;
    
    if (exportFmt === 'svg') {
      // SVG Export
      let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${state.canvasWidth}" height="${state.canvasHeight}" viewBox="0 0 ${state.canvasWidth} ${state.canvasHeight}">
  <rect width="100%" height="100%" fill="#ffffff"/>
`;
      
      state.elements.forEach((element) => {
        if (element.visible === false) return;
        
        const transform = element.rotation ? `transform="rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})"` : '';
        
        if (element.type === 'text') {
          svgContent += `  <text x="${element.x}" y="${element.y + (element.fontSize || 24)}" font-family="${element.fontFamily || 'DM Sans'}" font-size="${element.fontSize || 24}" font-weight="${element.fontWeight || 400}" fill="${element.color || '#000000'}" opacity="${element.opacity}" ${transform}>${element.text || ''}</text>
`;
        } else if (element.type === 'rectangle') {
          let fill = element.fill || '#3B82F6';
          if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
            svgContent += `  <defs>
    <linearGradient id="grad_${element.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${element.gradient.colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${element.gradient.colors[1]};stop-opacity:1" />
    </linearGradient>
  </defs>
`;
            fill = `url(#grad_${element.id})`;
          }
          svgContent += `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${fill}" stroke="${element.stroke || 'none'}" stroke-width="${element.strokeWidth || 0}" opacity="${element.opacity}" ${transform}/>
`;
        } else if (element.type === 'circle') {
          let fill = element.fill || '#EF4444';
          if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
            svgContent += `  <defs>
    <radialGradient id="grad_${element.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${element.gradient.colors[0]};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${element.gradient.colors[1]};stop-opacity:1" />
    </radialGradient>
  </defs>
`;
            fill = `url(#grad_${element.id})`;
          }
          svgContent += `  <ellipse cx="${element.x + element.width/2}" cy="${element.y + element.height/2}" rx="${element.width/2}" ry="${element.height/2}" fill="${fill}" stroke="${element.stroke || 'none'}" stroke-width="${element.strokeWidth || 0}" opacity="${element.opacity}" ${transform}/>
`;
        } else if (element.type === 'line') {
          svgContent += `  <line x1="${element.x}" y1="${element.y}" x2="${element.x + element.width}" y2="${element.y + element.height}" stroke="${element.stroke || '#ffffff'}" stroke-width="${element.strokeWidth || 2}" opacity="${element.opacity}" ${transform}/>
`;
        } else if (element.type === 'image' && element.src) {
          svgContent += `  <image href="${element.src}" x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" opacity="${element.opacity}" ${transform}/>
`;
        }
      });
      
      svgContent += '</svg>';
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'piui-cover.svg';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    
    // PNG/JPG Export
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

  const handleCopyToClipboard = useCallback(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      state.elements.forEach((element) => {
        ctx.save();
        ctx.globalAlpha = element.opacity;
        
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        
        // Apply shadow if present
        if (element.shadowColor) {
          ctx.shadowColor = element.shadowColor;
          ctx.shadowBlur = element.shadowBlur || 0;
          ctx.shadowOffsetX = element.shadowOffsetX || 0;
          ctx.shadowOffsetY = element.shadowOffsetY || 0;
        }
        
        if (element.type === 'text') {
          ctx.font = `${element.fontWeight || 400} ${element.fontSize || 24}px ${element.fontFamily || 'DM Sans'}`;
          ctx.fillStyle = element.color || '#000000';
          ctx.textBaseline = 'top';
          ctx.textAlign = element.textAlign || 'left';
          if (element.fontStyle === 'italic') {
            ctx.font = `italic ${ctx.font}`;
          }
          ctx.fillText(element.text || '', element.x, element.y);
        } else if (element.type === 'rectangle') {
          let fill = element.fill || '#3B82F6';
          if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
            const angle = element.gradient.angle || 45;
            const angleRad = (angle - 90) * Math.PI / 180;
            const grad = ctx.createLinearGradient(
              element.x + element.width/2 - Math.cos(angleRad) * element.width/2,
              element.y + element.height/2 - Math.sin(angleRad) * element.height/2,
              element.x + element.width/2 + Math.cos(angleRad) * element.width/2,
              element.y + element.height/2 + Math.sin(angleRad) * element.height/2
            );
            grad.addColorStop(0, element.gradient.colors[0]);
            grad.addColorStop(1, element.gradient.colors[1]);
            fill = grad as unknown as string;
          }
          ctx.fillStyle = fill;
          ctx.fillRect(element.x, element.y, element.width, element.height);
          if (element.strokeWidth) {
            ctx.strokeStyle = element.stroke || '#000000';
            ctx.lineWidth = element.strokeWidth;
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
        } else if (element.type === 'circle') {
          let fill = element.fill || '#EF4444';
          if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
            const grad = ctx.createRadialGradient(
              element.x + element.width/2, element.y + element.height/2, 0,
              element.x + element.width/2, element.y + element.height/2, element.width/2
            );
            grad.addColorStop(0, element.gradient.colors[0]);
            grad.addColorStop(1, element.gradient.colors[1]);
            fill = grad as unknown as string;
          }
          ctx.fillStyle = fill;
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
      
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    }
  }, [state]);

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
      // Tool shortcuts (when not in input)
      else if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        // Select tool (V)
        if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
          setTool('select');
        }
        // Text tool (T)
        else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
          setTool('text');
        }
        // Rectangle tool (R)
        else if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
          setTool('rect');
        }
        // Circle tool (C)
        else if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
          setTool('circle');
        }
        // Line tool (L)
        else if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
          setTool('line');
        }
        // Image tool (I)
        else if (e.key === 'i' && !e.ctrlKey && !e.metaKey) {
          // Trigger image upload
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) fileInput.click();
        }
        // Escape to deselect
        else if (e.key === 'Escape') {
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, state.selectedIds, state.elements, deleteElements, duplicateElements, addElements, setTool, clearSelection]);

  const selectedElements = state.elements.filter((el: CanvasElement) => state.selectedIds.includes(el.id));

  return (
    <div className="app">
      <Header
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
        onCopyToClipboard={handleCopyToClipboard}
        onSave={handleSave}
        onLoad={() => setShowProjectManager(true)}
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
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        onLoadProject={handleLoadProject}
      />
    </div>
  );
}

export default App;
