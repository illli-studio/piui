import type { CanvasSize } from '../types';
import { CANVAS_PRESETS } from '../types';

interface SidebarProps {
  currentSize: { width: number; height: number };
  onSizeSelect: (size: CanvasSize) => void;
  onToolSelect: (tool: string) => void;
  currentTool: string;
}

export function Sidebar({ currentSize, onSizeSelect, onToolSelect, currentTool }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Canvas Size</div>
        <div className="size-grid">
          {CANVAS_PRESETS.map(size => (
            <div
              key={size.id}
              className={`size-card ${currentSize.width === size.width && currentSize.height === size.height ? 'active' : ''}`}
              onClick={() => onSizeSelect(size)}
            >
              <div className="size-name">{size.name}</div>
              <div className="size-dimensions">{size.width} × {size.height}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Tools</div>
        <div className="tools-grid">
          <button
            className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
            onClick={() => onToolSelect('select')}
          >
            <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <span className="tool-label">Select</span>
          </button>
          <button
            className={`tool-btn ${currentTool === 'text' ? 'active' : ''}`}
            onClick={() => onToolSelect('text')}
          >
            <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3M9 20h6M12 4v16" />
            </svg>
            <span className="tool-label">Text</span>
          </button>
          <button
            className={`tool-btn ${currentTool === 'rect' ? 'active' : ''}`}
            onClick={() => onToolSelect('rect')}
          >
            <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <span className="tool-label">Rect</span>
          </button>
          <button
            className={`tool-btn ${currentTool === 'circle' ? 'active' : ''}`}
            onClick={() => onToolSelect('circle')}
          >
            <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="tool-label">Circle</span>
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Layers</div>
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div className="empty-state-title">No layers yet</div>
          <div className="empty-state-desc">Add elements to see them here</div>
        </div>
      </div>
    </div>
  );
}
