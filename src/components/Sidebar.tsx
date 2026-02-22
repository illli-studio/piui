import { useRef } from 'react';
import type { CanvasSize } from '../types';
import { CANVAS_PRESETS } from '../types';

interface SidebarProps {
  currentSize: { width: number; height: number };
  onSizeSelect: (size: CanvasSize) => void;
  onToolSelect: (tool: string) => void;
  currentTool: string;
  onImageUpload: (file: File) => void;
}

export function Sidebar({ currentSize, onSizeSelect, onToolSelect, currentTool, onImageUpload }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

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
        <div style={{ marginTop: 12 }}>
          <button
            className={`tool-btn ${currentTool === 'image' ? 'active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '100%', aspectRatio: 'auto', padding: '12px' }}
          >
            <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="tool-label">Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
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
