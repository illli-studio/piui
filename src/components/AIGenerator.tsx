import { useState } from 'react';

interface AIGeneratorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function AIGenerator({ onGenerate, isGenerating }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const handleApiKeySave = () => {
    localStorage.setItem('piui_api_key', apiKey);
    setShowSettings(false);
  };

  const presets = [
    'Dark tech YouTube thumbnail with neon accents',
    'Neon cyberpunk Instagram post with city skyline',
    'Minimalist quote graphic with soft gradients',
    'Bold sale banner with discount badges',
    'Gaming TikTok cover with character silhouette',
  ];

  return (
    <div className="ai-generator">
      <div className="sidebar-section-title" style={{ marginBottom: 12 }}>AI Cover Generator</div>
      
      {/* API Settings */}
      <button 
        className="btn btn-ghost" 
        style={{ fontSize: 11, marginBottom: 8, width: '100%' }}
        onClick={() => setShowSettings(!showSettings)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        {showSettings ? 'Hide Settings' : 'API Settings'}
      </button>
      
      {showSettings && (
        <div style={{ marginBottom: 12, padding: 8, background: 'var(--surface-elevated)', borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>MiniMax API Key</div>
          <input
            type="password"
            className="properties-input"
            placeholder="Enter API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ fontSize: 12 }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleApiKeySave}
            style={{ marginTop: 6, width: '100%', fontSize: 12, padding: '6px' }}
          >
            Save
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="ai-input"
          placeholder="Describe your cover in detail..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <button 
          type="submit" 
          className="btn btn-primary ai-generate-btn"
          disabled={isGenerating || !prompt.trim()}
          style={{ marginTop: 8 }}
        >
          {isGenerating ? (
            <>
              <span className="loading">⏳</span>
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
              Generate with AI
            </>
          )}
        </button>
      </form>
      
      <div style={{ marginTop: 16 }}>
        <div className="sidebar-section-title" style={{ fontSize: 11, marginBottom: 8 }}>Quick Prompts</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {presets.map((preset, i) => (
            <button
              key={i}
              className="btn btn-ghost"
              style={{ fontSize: 11, padding: '4px 8px', background: 'var(--surface-elevated)' }}
              onClick={() => setPrompt(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
