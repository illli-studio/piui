import { useState } from 'react';

interface AIGeneratorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function AIGenerator({ onGenerate, isGenerating }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const presets = [
    'Dark tech YouTube thumbnail',
    'Neon cyberpunk Instagram post',
    'Minimalist quote graphic',
    'Bold sale banner',
    'Gaming TikTok cover',
  ];

  return (
    <div className="ai-generator">
      <div className="sidebar-section-title" style={{ marginBottom: 12 }}>AI Cover Generator</div>
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
