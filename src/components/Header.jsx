import React from 'react';
import { Film, Sparkles, FolderOpen, RefreshCw } from 'lucide-react';

export const Header = ({ onOpenOutputFolder, onResetSettings, outputsCount = 0 }) => {
  return (
    <header className="app-header">
      <div className="logo-badge">
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0a192f 0%, #1e3a8a 100%)',
          border: '1.5px solid rgba(217, 119, 6, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
          boxShadow: '0 4px 14px rgba(10, 25, 47, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}>
          <Film size={20} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.025em', color: '#0a192f' }}>
              ReelCraft
            </h1>
            <span className="badge-916">9:16 STUDIO</span>
          </div>
          <p style={{ fontSize: '11.5px', color: '#64748b', marginTop: '0px', fontWeight: 500 }}>
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
          <FolderOpen size={14} style={{ color: '#d97706' }} />
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
