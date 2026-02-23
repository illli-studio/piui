interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format?: 'png' | 'jpg') => void;
}

export function Header({ onUndo, onRedo, onExport }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">π</div>
        <h1 className="header-title">PiUI</h1>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost" onClick={onUndo} title="Undo (Ctrl+Z)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6M3 13a9 9 0 1 0 2.5-6.3L3 7" />
          </svg>
        </button>
        <button className="btn btn-ghost" onClick={onRedo} title="Redo (Ctrl+Shift+Z)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6M21 13a9 9 0 1 1-2.5-6.3L21 7" />
          </svg>
        </button>
        <button className="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
          Save
        </button>
        <div className="export-dropdown">
          <button className="btn btn-primary" onClick={() => onExport('png')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
          <div className="export-menu">
            <button onClick={() => onExport('png')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              Export as PNG
            </button>
            <button onClick={() => onExport('jpg')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              Export as JPG
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
