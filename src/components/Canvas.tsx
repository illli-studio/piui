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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedIds, elements, dragStart, dragOffset, zoom, onUpdateElement]);

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
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onDoubleClick={(e) => handleTextDoubleClick(e, element)}
          >
            {element.text}
          </div>
        );
      }
    } else if (element.type === 'rectangle') {
      content = (
        <div
          className="canvas-element"
          style={{
            ...style,
            backgroundColor: element.fill || '#3B82F6',
            border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
            borderRadius: 8,
          }}
          onMouseDown={(e) => handleElementMouseDown(e, element)}
        />
      );
    } else if (element.type === 'circle') {
      content = (
        <div
          className="canvas-element"
          style={{
            ...style,
            backgroundColor: element.fill || '#EF4444',
            border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke || '#000000'}` : 'none',
            borderRadius: '50%',
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
