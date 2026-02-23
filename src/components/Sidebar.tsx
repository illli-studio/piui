import { useState, useRef } from 'react';
import { TEMPLATES } from '../data/templates';

interface SidebarProps {
  currentSize: { width: number; height: number };
  onSizeSelect: (size: { width: number; height: number }) => void;
  onToolSelect: (tool: string) => void;
  currentTool: string;
  onImageUpload: (file: File) => void;
  onTemplateSelect: (template: any) => void;
  onClearCanvas: () => void;
}

export function Sidebar({ 
  currentSize, 
  onSizeSelect, 
  onToolSelect, 
  currentTool, 
  onImageUpload,
  onTemplateSelect,
  onClearCanvas,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleSizeSelect = (width: number, height: number) => {
    onSizeSelect({ width, height });
  };

  return (
    <div className="sidebar">
      {!showTemplates ? (
        <>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Templates</div>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginBottom: 8 }}
              onClick={() => setShowTemplates(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Browse Templates
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Canvas Size</div>
            <div className="size-grid">
              <div
                className={`size-card ${currentSize.width === 1280 && currentSize.height === 720 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(1280, 720)}
              >
                <div className="size-name">YouTube</div>
                <div className="size-dimensions">1280 × 720</div>
              </div>
              <div
                className={`size-card ${currentSize.width === 1080 && currentSize.height === 1080 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(1080, 1080)}
              >
                <div className="size-name">Instagram</div>
                <div className="size-dimensions">1080 × 1080</div>
              </div>
              <div
                className={`size-card ${currentSize.width === 1080 && currentSize.height === 1920 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(1080, 1920)}
              >
                <div className="size-name">TikTok</div>
                <div className="size-dimensions">1080 × 1920</div>
              </div>
              <div
                className={`size-card ${currentSize.width === 820 && currentSize.height === 312 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(820, 312)}
              >
                <div className="size-name">Facebook</div>
                <div className="size-dimensions">820 × 312</div>
              </div>
              <div
                className={`size-card ${currentSize.width === 1500 && currentSize.height === 500 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(1500, 500)}
              >
                <div className="size-name">Twitter</div>
                <div className="size-dimensions">1500 × 500</div>
              </div>
              <div
                className={`size-card ${currentSize.width === 1200 && currentSize.height === 628 ? 'active' : ''}`}
                onClick={() => handleSizeSelect(1200, 628)}
              >
                <div className="size-name">Banner</div>
                <div className="size-dimensions">1200 × 628</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Tools</div>
            <div className="tools-grid">
              <button
                className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
                onClick={() => onToolSelect('select')}
                title="Select (V)"
              >
                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                </svg>
                <span className="tool-label">Select</span>
              </button>
              <button
                className={`tool-btn ${currentTool === 'text' ? 'active' : ''}`}
                onClick={() => onToolSelect('text')}
                title="Text (T)"
              >
                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                </svg>
                <span className="tool-label">Text</span>
              </button>
              <button
                className={`tool-btn ${currentTool === 'rect' ? 'active' : ''}`}
                onClick={() => onToolSelect('rect')}
                title="Rectangle (R)"
              >
                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <span className="tool-label">Rect</span>
              </button>
              <button
                className={`tool-btn ${currentTool === 'circle' ? 'active' : ''}`}
                onClick={() => onToolSelect('circle')}
                title="Circle (C)"
              >
                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="tool-label">Circle</span>
              </button>
              <button
                className={`tool-btn ${currentTool === 'line' ? 'active' : ''}`}
                onClick={() => onToolSelect('line')}
                title="Line (L)"
              >
                <svg className="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="19" x2="19" y2="5" />
                </svg>
                <span className="tool-label">Line</span>
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                className={`tool-btn ${currentTool === 'image' ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', aspectRatio: 'auto', padding: '12px' }}
                title="Upload Image (I)"
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

          <div className="sidebar-section" style={{ marginTop: 'auto' }}>
            <div className="sidebar-section-title" style={{ fontSize: 11, marginBottom: 8, color: 'var(--text-muted)' }}>Keyboard Shortcuts</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div><kbd style={{ background: 'var(--surface-elevated)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>Ctrl+Z</kbd> Undo</div>
              <div><kbd style={{ background: 'var(--surface-elevated)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>Ctrl+Shift+Z</kbd> Redo</div>
              <div><kbd style={{ background: 'var(--surface-elevated)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>Delete</kbd> Delete</div>
              <div><kbd style={{ background: 'var(--surface-elevated)', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>Ctrl+S</kbd> Save</div>
            </div>
          </div>

          <div className="sidebar-section">
            <button 
              className="btn btn-ghost" 
              style={{ width: '100%', color: 'var(--error)' }}
              onClick={onClearCanvas}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
              </svg>
              Clear Canvas
            </button>
          </div>
        </>
      ) : (
        <div className="sidebar-section" style={{ flex: 1, overflow: 'auto' }}>
          <button 
            className="btn btn-ghost" 
            style={{ marginBottom: 16 }}
            onClick={() => setShowTemplates(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
            Back
          </button>
          <div className="sidebar-section-title">Templates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TEMPLATES.map(template => (
              <div
                key={template.id}
                className="size-card"
                onClick={() => {
                  onTemplateSelect(template);
                  setShowTemplates(false);
                }}
                style={{ textAlign: 'left', padding: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>{template.thumbnail}</span>
                  <div className="size-name" style={{ marginBottom: 0 }}>{template.name}</div>
                </div>
                <div className="size-dimensions">{template.canvasWidth} × {template.canvasHeight}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
