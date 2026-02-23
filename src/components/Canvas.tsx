import { useRef, useState, useCallback, useEffect } from 'react';
import type { CanvasElement } from '../types';

interface CanvasProps {
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedIds: string[];
  zoom: number;
  tool: string;
  onSelect: (id: string, addToSelection: boolean) => void;
  onClearSelection: () => void;
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export function Canvas({
  width,
  height,
  elements,
  selectedIds,
  zoom,
  tool,
  onSelect,
  onClearSelection,
  onAddElement,
  onUpdateElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0, rotation: 0, centerX: 0, centerY: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onClearSelection();
      
      if (tool === 'text') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom;
          const y = (e.clientY - rect.top) / zoom;
          onAddElement({
            type: 'text',
            x,
            y,
            width: 200,
            height: 40,
            rotation: 0,
            opacity: 1,
            text: 'Double click to edit',
            fontSize: 24,
            color: '#000000',
          });
        }
      } else if (tool === 'rect') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom;
          const y = (e.clientY - rect.top) / zoom;
          onAddElement({
            type: 'rectangle',
            x,
            y,
            width: 200,
            height: 150,
            rotation: 0,
            opacity: 1,
            fill: '#3B82F6',
            stroke: '#000000',
            strokeWidth: 0,
          });
        }
      } else if (tool === 'circle') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left) / zoom;
          const y = (e.clientY - rect.top) / zoom;
          onAddElement({
            type: 'circle',
            x,
            y,
            width: 150,
            height: 150,
            rotation: 0,
            opacity: 1,
            fill: '#EF4444',
            stroke: '#000000',
            strokeWidth: 0,
          });
        }
      }
    }
  }, [tool, zoom, onClearSelection, onAddElement]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    
    // Skip if element is hidden or locked
    if (element.visible === false || element.locked === true) {
      return;
    }
    
    onSelect(element.id, e.shiftKey);
    
    if (tool === 'select') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setIsDragging(true);
        setDragStart({
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
        });
        setDragOffset({
          x: element.x,
          y: element.y,
        });
      }
    }
  }, [tool, zoom, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    const element = elements.find(el => selectedIds.includes(el.id));
    if (element) {
      setIsResizing(true);
      setResizeHandle(handle);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setResizeStart({
          width: element.width,
          height: element.height,
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
          rotation: element.rotation,
          centerX: element.x + element.width / 2,
          centerY: element.y + element.height / 2,
        });
      }
    }
  }, [selectedIds, elements, zoom]);

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const element = elements.find(el => selectedIds.includes(el.id));
    if (element) {
      setIsRotating(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setResizeStart({
          width: element.width,
          height: element.height,
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
          rotation: element.rotation,
          centerX: element.x + element.width / 2,
          centerY: element.y + element.height / 2,
        });
      }
    }
  }, [selectedIds, elements, zoom]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedIds.length > 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const currentX = (e.clientX - rect.left) / zoom;
          const currentY = (e.clientY - rect.top) / zoom;
          const dx = currentX - dragStart.x;
          const dy = currentY - dragStart.y;
          
          selectedIds.forEach(id => {
            const element = elements.find(el => el.id === id);
            if (element) {
              onUpdateElement(id, {
                x: dragOffset.x + dx,
                y: dragOffset.y + dy,
              });
            }
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedIds, elements, dragStart, dragOffset, zoom, onUpdateElement, resizeStart, resizeHandle]);

  // Handle resizing move
  useEffect(() => {
    if (!isResizing || !resizeHandle || selectedIds.length === 0) return;

    const handleResizeMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = (e.clientX - rect.left) / zoom;
      const currentY = (e.clientY - rect.top) / zoom;
      const dx = currentX - resizeStart.x;
      const dy = currentY - resizeStart.y;

      const element = elements.find(el => selectedIds.includes(el.id));
      if (!element) return;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      if (resizeHandle.includes('e')) newWidth = Math.max(20, resizeStart.width + dx);
      if (resizeHandle.includes('w')) newWidth = Math.max(20, resizeStart.width - dx);
      if (resizeHandle.includes('s')) newHeight = Math.max(20, resizeStart.height + dy);
      if (resizeHandle.includes('n')) newHeight = Math.max(20, resizeStart.height - dy);

      let newX = element.x;
      let newY = element.y;

      if (resizeHandle.includes('w')) {
        newX = element.x + (element.width - newWidth);
      }
      if (resizeHandle.includes('n')) {
        newY = element.y + (element.height - newHeight);
      }

      onUpdateElement(element.id, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      });
    };

    window.addEventListener('mousemove', handleResizeMove);
    return () => window.removeEventListener('mousemove', handleResizeMove);
  }, [isResizing, resizeHandle, selectedIds, elements, resizeStart, zoom, onUpdateElement]);

  // Handle rotation
  useEffect(() => {
    if (!isRotating || selectedIds.length === 0) return;

    const element = elements.find(el => selectedIds.includes(el.id));
    if (!element) return;

    const handleRotateMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = (e.clientX - rect.left) / zoom;
      const currentY = (e.clientY - rect.top) / zoom;

      const centerX = resizeStart.centerX;
      const centerY = resizeStart.centerY;

      const angle = Math.atan2(currentY - centerY, currentX - centerX);
      const startAngle = Math.atan2(resizeStart.y - centerY, resizeStart.x - centerX);
      const deltaAngle = (angle - startAngle) * (180 / Math.PI);

      const newRotation = resizeStart.rotation + deltaAngle;
      onUpdateElement(element.id, { rotation: newRotation });
    };

    const handleRotateEnd = () => {
      setIsRotating(false);
    };

    window.addEventListener('mousemove', handleRotateMove);
    window.addEventListener('mouseup', handleRotateEnd);
    return () => {
      window.removeEventListener('mousemove', handleRotateMove);
      window.removeEventListener('mouseup', handleRotateEnd);
    };
  }, [isRotating, selectedIds, elements, resizeStart, zoom, onUpdateElement]);

  const handleTextDoubleClick = useCallback((e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (element.type === 'text' && tool === 'select') {
      setEditingTextId(element.id);
      setEditText(element.text || '');
    }
  }, [tool]);

  const handleTextEditBlur = useCallback(() => {
    if (editingTextId) {
      onUpdateElement(editingTextId, { text: editText });
      setEditingTextId(null);
      setEditText('');
    }
  }, [editingTextId, editText, onUpdateElement]);

  const handleTextEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingTextId(null);
      setEditText('');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextEditBlur();
    }
  }, [handleTextEditBlur]);

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedIds.includes(element.id);
    
    // Don't render hidden elements
    if (element.visible === false) {
      return null;
    }
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      cursor: tool === 'select' ? 'move' : 'default',
    };

    let content;
    if (element.type === 'text') {
      const isEditing = editingTextId === element.id;
      
      if (isEditing) {
        content = (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleTextEditBlur}
            onKeyDown={handleTextEditKeyDown}
            autoFocus
            className="text-editor-input"
            style={{
              ...style,
              fontSize: element.fontSize || 24,
              color: element.color || '#000000',
              fontFamily: element.fontFamily || 'DM Sans',
              fontWeight: element.fontWeight || 400,
              fontStyle: element.fontStyle,
              background: 'transparent',
              border: '1px dashed #F97316',
              outline: 'none',
              padding: 4,
            }}
          />
        );
      } else {
        content = (
          <div
            className="canvas-element canvas-text"
            style={{
              ...style,
              fontSize: element.fontSize || 24,
              color: element.color || '#000000',
              fontFamily: element.fontFamily || 'DM Sans',
              fontWeight: element.fontWeight || 400,
              fontStyle: element.fontStyle,
              textShadow: element.shadowColor ? 
                `${element.shadowOffsetX || 0}px ${element.shadowOffsetY || 0}px ${element.shadowBlur || 0}px ${element.shadowColor}` 
                : undefined,
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onDoubleClick={(e) => handleTextDoubleClick(e, element)}
          >
            {element.text}
          </div>
        );
      }
    } else if (element.type === 'rectangle') {
      // Build gradient background
      let background = element.fill || '#3B82F6';
      if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
        const angle = element.gradient.angle || 45;
        background = `linear-gradient(${angle}deg, ${element.gradient.colors[0]}, ${element.gradient.colors[1]})`;
      }
      
      content = (
        <div
          className="canvas-element"
          style={{
            ...style,
            background: background,
            border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
            borderRadius: 8,
            boxShadow: element.shadowColor ? 
              `${element.shadowOffsetX || 0}px ${element.shadowOffsetY || 0}px ${element.shadowBlur || 0}px ${element.shadowColor}` 
              : undefined,
          }}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
        />
      );
    } else if (element.type === 'circle') {
      // Build gradient background
      let background = element.fill || '#EF4444';
      if (element.gradient && element.gradient.colors && element.gradient.colors.length >= 2) {
        background = `radial-gradient(circle, ${element.gradient.colors[0]}, ${element.gradient.colors[1]})`;
      }
      
      content = (
        <div
          className="canvas-element"
          style={{
            ...style,
            background: background,
            border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
            borderRadius: '50%',
            boxShadow: element.shadowColor ? 
              `${element.shadowOffsetX || 0}px ${element.shadowOffsetY || 0}px ${element.shadowBlur || 0}px ${element.shadowColor}` 
              : undefined,
          }}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
        />
      );
    } else if (element.type === 'image' && element.src) {
      content = (
        <img
          src={element.src}
          alt=""
          style={{
            ...style,
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
        />
      );
    }

    return (
      <div key={element.id} style={{ position: 'absolute', left: element.x, top: element.y }}>
        {content}
        {isSelected && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                border: '2px solid #F97316',
                pointerEvents: 'none',
              }}
            />
            {/* Resize handles */}
            <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
            <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')} />
            <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            {/* Rotate handle */}
            <div className="rotate-handle" onMouseDown={handleRotateStart}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="canvas-area">
      <div
        ref={canvasRef}
        className="canvas-wrapper"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="canvas"
          style={{ width, height }}
          onClick={handleCanvasClick}
        >
          {elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
}
