import type { CanvasElement } from '../types';

interface PropertiesPanelProps {
  selectedElements: CanvasElement[];
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

export function PropertiesPanel({ selectedElements, onUpdate }: PropertiesPanelProps) {
  if (selectedElements.length === 0) {
    return (
      <div className="properties-panel">
        <div className="properties-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <p style={{ marginTop: 16 }}>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const element = selectedElements[0];

  return (
    <div className="properties-panel">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Position & Size</div>
        <div className="properties-row">
          <label className="properties-label">X</label>
          <input
            type="number"
            className="properties-input properties-input-small"
            value={Math.round(element.x)}
            onChange={e => onUpdate(element.id, { x: Number(e.target.value) })}
          />
          <label className="properties-label">Y</label>
          <input
            type="number"
            className="properties-input properties-input-small"
            value={Math.round(element.y)}
            onChange={e => onUpdate(element.id, { y: Number(e.target.value) })}
          />
        </div>
        <div className="properties-row">
          <label className="properties-label">W</label>
          <input
            type="number"
            className="properties-input properties-input-small"
            value={Math.round(element.width)}
            onChange={e => onUpdate(element.id, { width: Number(e.target.value) })}
          />
          <label className="properties-label">H</label>
          <input
            type="number"
            className="properties-input properties-input-small"
            value={Math.round(element.height)}
            onChange={e => onUpdate(element.id, { height: Number(e.target.value) })}
          />
        </div>
        <div className="properties-row">
          <label className="properties-label">Rotation</label>
          <input
            type="number"
            className="properties-input"
            value={Math.round(element.rotation)}
            onChange={e => onUpdate(element.id, { rotation: Number(e.target.value) })}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>°</span>
        </div>
        <div className="properties-row">
          <label className="properties-label">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity}
            onChange={e => onUpdate(element.id, { opacity: Number(e.target.value) })}
            style={{ flex: 1 }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 30 }}>{Math.round(element.opacity * 100)}%</span>
        </div>
      </div>

      {element.type === 'text' && (
        <div className="properties-section">
          <div className="sidebar-section-title">Text</div>
          <div className="properties-row">
            <label className="properties-label">Text</label>
            <input
              type="text"
              className="properties-input"
              value={element.text || ''}
              onChange={e => onUpdate(element.id, { text: e.target.value })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Font Size</label>
            <input
              type="number"
              className="properties-input"
              value={element.fontSize || 24}
              onChange={e => onUpdate(element.id, { fontSize: Number(e.target.value) })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Color</label>
            <input
              type="color"
              className="color-input"
              value={element.color || '#000000'}
              onChange={e => onUpdate(element.id, { color: e.target.value })}
            />
          </div>
        </div>
      )}

      {(element.type === 'rectangle' || element.type === 'circle') && (
        <div className="properties-section">
          <div className="sidebar-section-title">Fill & Stroke</div>
          <div className="properties-row">
            <label className="properties-label">Fill</label>
            <input
              type="color"
              className="color-input"
              value={element.fill || '#3B82F6'}
              onChange={e => onUpdate(element.id, { fill: e.target.value })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Stroke</label>
            <input
              type="color"
              className="color-input"
              value={element.stroke || '#000000'}
              onChange={e => onUpdate(element.id, { stroke: e.target.value })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Width</label>
            <input
              type="number"
              className="properties-input"
              value={element.strokeWidth || 0}
              onChange={e => onUpdate(element.id, { strokeWidth: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <div className="ai-panel">
        <div className="sidebar-section-title" style={{ marginBottom: 12 }}>AI Generate</div>
        <div className="ai-input-wrapper">
          <textarea
            className="ai-input"
            placeholder="Describe your cover... e.g., 'A dark theme YouTube thumbnail with neon blue accents and bold text'"
          />
          <button className="btn btn-primary ai-generate-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
            Generate with AI
          </button>
        </div>
      </div>
    </div>
  );
}
