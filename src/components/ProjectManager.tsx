import { useState, useEffect } from 'react';

interface Project {
  name: string;
  width: number;
  height: number;
  elements: any[];
  savedAt: string;
}

interface ProjectManagerProps {
  onLoadProject: (project: Project) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectManager({ onLoadProject, isOpen, onClose }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('piui_projects') || '[]');
      setProjects(saved);
    }
  }, [isOpen]);

  const handleDelete = (index: number) => {
    if (confirm('Delete this project?')) {
      const updated = [...projects];
      updated.splice(index, 1);
      localStorage.setItem('piui_projects', JSON.stringify(updated));
      setProjects(updated);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>My Projects</h3>
          <button className="btn btn-ghost" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          {projects.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <p>No saved projects yet</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-info">
                    <div className="project-name">{project.name}</div>
                    <div className="project-meta">
                      {project.width}x{project.height} • {new Date(project.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => { onLoadProject(project); onClose(); }}
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Load
                    </button>
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => handleDelete(index)}
                      style={{ color: 'var(--error)', padding: '6px' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
