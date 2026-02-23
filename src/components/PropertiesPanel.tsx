import type { CanvasElement } from '../types';
import { AIGenerator } from './AIGenerator';

interface PropertiesPanelProps {
  selectedElements: CanvasElement[];
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (ids: string[]) => void;
  onAIGenerate: (prompt: string) => void;
  isGeneratingAI: boolean;
}

export function PropertiesPanel({ 
  selectedElements, 
  onUpdate, 
  onDelete,
  onAIGenerate,
  isGeneratingAI,
}: PropertiesPanelProps) {
  if (selectedElements.length === 0) {
    return (
      <div className="properties-panel">
        <AIGenerator onGenerate={onAIGenerate} isGenerating={isGeneratingAI} />
        <div className="properties-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <p style={{ marginTop: 16 }}>Select an element to edit properties, or use AI to generate covers</p>
        </div>
      </div>
    );
  }

  const element = selectedElements[0];

  return (
    <div className="properties-panel">
      <div className="sidebar-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sidebar-section-title" style={{ marginBottom: 0 }}>Selected: {element.type}</div>
        <button 
          className="btn btn-ghost" 
          style={{ color: 'var(--error)', padding: '4px 8px' }}
          onClick={() => onDelete([element.id])}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
          </svg>
        </button>
      </div>

      <div className="properties-section">
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
          <div className="properties-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <textarea
              className="properties-input"
              style={{ minHeight: 60, resize: 'vertical' }}
              value={element.text || ''}
              onChange={e => onUpdate(element.id, { text: e.target.value })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Font</label>
            <select
              className="properties-input"
              value={element.fontFamily || 'DM Sans'}
              onChange={e => onUpdate(element.id, { fontFamily: e.target.value })}
            >
              <option value="DM Sans">DM Sans</option>
              <option value="Outfit">Outfit</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Fira Code">Fira Code</option>
            </select>
          </div>
          <div className="properties-row">
            <label className="properties-label">Size</label>
            <input
              type="number"
              className="properties-input"
              value={element.fontSize || 24}
              onChange={e => onUpdate(element.id, { fontSize: Number(e.target.value) })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Weight</label>
            <select
              className="properties-input"
              value={element.fontWeight || 400}
              onChange={e => onUpdate(element.id, { fontWeight: Number(e.target.value) })}
            >
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
            </select>
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
          <div className="properties-row">
            <label className="properties-label">Align</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className={`btn btn-ghost ${element.textAlign === 'left' ? 'active' : ''}`}
                style={{ padding: '4px 8px' }}
                onClick={() => onUpdate(element.id, { textAlign: 'left' })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
                </svg>
              </button>
              <button
                className={`btn btn-ghost ${element.textAlign === 'center' ? 'active' : ''}`}
                style={{ padding: '4px 8px' }}
                onClick={() => onUpdate(element.id, { textAlign: 'center' })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
                </svg>
              </button>
              <button
                className={`btn btn-ghost ${element.textAlign === 'right' ? 'active' : ''}`}
                style={{ padding: '4px 8px' }}
                onClick={() => onUpdate(element.id, { textAlign: 'right' })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
                </svg>
              </button>
            </div>
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
              onChange={e => onUpdate(element.id, { fill: e.target.value, gradient: undefined })}
            />
          </div>
          
          {/* Gradient Toggle */}
          <div className="properties-row">
            <label className="properties-label">Gradient</label>
            <button
              className={`btn btn-ghost ${element.gradient ? 'active' : ''}`}
              style={{ padding: '4px 8px', fontSize: 12 }}
              onClick={() => {
                if (element.gradient) {
                  onUpdate(element.id, { gradient: undefined });
                } else {
                  onUpdate(element.id, { 
                    gradient: { 
                      type: 'linear', 
                      colors: [element.fill || '#3B82F6', '#ffffff'],
                      angle: 45 
                    } 
                  });
                }
              }}
            >
              {element.gradient ? '✓ On' : 'Off'}
            </button>
          </div>
          
          {/* Gradient Colors */}
          {element.gradient && (
            <>
              <div className="properties-row">
                <label className="properties-label">Color 1</label>
                <input
                  type="color"
                  className="color-input"
                  value={element.gradient.colors[0] || '#3B82F6'}
                  onChange={e => {
                    const colors = [...element.gradient!.colors];
                    colors[0] = e.target.value;
                    onUpdate(element.id, { gradient: { type: 'linear', colors } });
                  }}
                />
              </div>
              <div className="properties-row">
                <label className="properties-label">Color 2</label>
                <input
                  type="color"
                  className="color-input"
                  value={element.gradient.colors[1] || '#ffffff'}
                  onChange={e => {
                    const colors = [...element.gradient!.colors];
                    colors[1] = e.target.value;
                    onUpdate(element.id, { gradient: { type: 'linear', colors } });
                  }}
                />
              </div>
              <div className="properties-row">
                <label className="properties-label">Angle</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={element.gradient.angle || 45}
                  onChange={e => {
                    const angle = Number(e.target.value);
                    onUpdate(element.id, { gradient: { type: 'linear', colors: element.gradient!.colors, angle } });
                  }}
                  style={{ flex: 1 }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 30 }}>{element.gradient.angle || 45}°</span>
              </div>
            </>
          )}
          
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

      {/* Shadow Section */}
      {(element.type === 'rectangle' || element.type === 'circle' || element.type === 'text') && (
        <div className="properties-section">
          <div className="sidebar-section-title">Shadow</div>
          <div className="properties-row">
            <label className="properties-label">Color</label>
            <input
              type="color"
              className="color-input"
              value={element.shadowColor || '#000000'}
              onChange={e => onUpdate(element.id, { shadowColor: e.target.value })}
            />
          </div>
          <div className="properties-row">
            <label className="properties-label">Blur</label>
            <input
              type="range"
              min="0"
              max="50"
              value={element.shadowBlur || 0}
              onChange={e => onUpdate(element.id, { shadowBlur: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 30 }}>{element.shadowBlur || 0}</span>
          </div>
          <div className="properties-row">
            <label className="properties-label">Offset X</label>
            <input
              type="number"
              className="properties-input"
              value={element.shadowOffsetX || 0}
              onChange={e => onUpdate(element.id, { shadowOffsetX: Number(e.target.value) })}
            />
            <label className="properties-label">Y</label>
            <input
              type="number"
              className="properties-input"
              value={element.shadowOffsetY || 0}
              onChange={e => onUpdate(element.id, { shadowOffsetY: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {element.type === 'image' && (
        <div className="properties-section">
          <div className="sidebar-section-title">Image</div>
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
          </div>
        </div>
      )}

      <AIGenerator onGenerate={onAIGenerate} isGenerating={isGeneratingAI} />
    </div>
  );
}
