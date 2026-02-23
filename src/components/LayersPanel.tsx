import type { CanvasElement } from '../types';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedIds: string[];
  onSelect: (id: string, addToSelection: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (id: string) => void;
}

export function LayersPanel({
  elements,
  selectedIds,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onReorder,
  onDelete,
}: LayersPanelProps) {
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
        );
      case 'rectangle':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
      case 'circle':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case 'image':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
    }
  };

  const getElementName = (element: CanvasElement) => {
    if (element.type === 'text') {
      return element.text?.slice(0, 20) || 'Text';
    }
    const typeNames: Record<string, string> = {
      rectangle: 'Rectangle',
      circle: 'Circle',
      image: 'Image',
    };
    return typeNames[element.type] || element.type;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Show layers in reverse order (top layer first)
  const reversedElements = [...elements].reverse();

  return (
    <div className="layers-panel">
      <div className="panel-header">
        <h3>Layers</h3>
        <span className="layer-count">{elements.length}</span>
      </div>
      
      <div className="layers-list">
        {elements.length === 0 ? (
          <div className="layers-empty">
            <p>No elements yet</p>
            <p className="hint">Add text, shapes, or images to get started</p>
          </div>
        ) : (
          reversedElements.map((element, index) => {
            // Calculate actual index in original array
            const actualIndex = elements.length - 1 - index;
            const isSelected = selectedIds.includes(element.id);
            const isLocked = element.locked === true;
            const isHidden = element.visible === false;

            return (
              <div
                key={element.id}
                className={`layer-item ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''} ${isHidden ? 'hidden' : ''}`}
                onClick={(e) => onSelect(element.id, e.shiftKey)}
                draggable
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDrop={(e) => handleDrop(e, actualIndex)}
                onDragOver={handleDragOver}
              >
                <div className="layer-drag-handle">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>
                
                <div className="layer-icon" style={{ 
                  backgroundColor: element.type === 'text' ? 'transparent' : (element.fill || '#3B82F6'),
                  color: element.type === 'text' ? '#A1A1AA' : '#fff'
                }}>
                  {getElementIcon(element.type)}
                </div>
                
                <div className="layer-name">
                  {getElementName(element)}
                </div>
                
                <div className="layer-actions">
                  <button
                    className={`layer-btn ${isHidden ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(element.id);
                    }}
                    title={isHidden ? 'Show' : 'Hide'}
                  >
                    {isHidden ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  
                  <button
                    className={`layer-btn ${isLocked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(element.id);
                    }}
                    title={isLocked ? 'Unlock' : 'Lock'}
                  >
                    {isLocked ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </svg>
                    )}
                  </button>
                  
                  <button
                    className="layer-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(element.id);
                    }}
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
