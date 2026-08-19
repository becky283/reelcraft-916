import React from 'react';
import { Film, Sparkles, FolderOpen, RefreshCw, Layers } from 'lucide-react';

export const Header = ({ onOpenOutputFolder, onResetSettings, outputsCount = 0 }) => {
  return (
    <header className="app-header">
      <div className="logo-badge">
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          <Film size={18} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.025em', color: '#fff' }}>
              ReelCraft
            </h1>
            <span className="badge-916">9:16 STUDIO</span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0px', letterSpacing: '0.01em' }}>
            Personal Local-First Video Automation (1080 × 1920)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-secondary"
          onClick={onOpenOutputFolder}
          title="Open exported MP4 folder in Windows Explorer"
          style={{ padding: '7px 13px', fontSize: '12px' }}
        >
          <FolderOpen size={14} />
          <span>Outputs {outputsCount > 0 && `(${outputsCount})`}</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onResetSettings}
          title="Reset to default template presets"
          style={{ padding: '7px 10px' }}
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
};
