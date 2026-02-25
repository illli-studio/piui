interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: (format?: 'png' | 'jpg' | 'svg') => void;
  onCopyToClipboard: () => void;
  onSave?: () => void;
  onLoad?: () => void;
}

export function Header({ onUndo, onRedo, onExport, onCopyToClipboard, onSave, onLoad }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">π</div>
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
        <button className="btn btn-secondary" onClick={onSave}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
          Save
        </button>
        <button className="btn btn-secondary" onClick={onLoad}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Load
        </button>
        <button className="btn btn-primary" onClick={() => onExport('png')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>
    </header>
  );
}
