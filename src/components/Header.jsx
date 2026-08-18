import React from 'react';
import { Film, Sparkles, FolderOpen, RefreshCw } from 'lucide-react';

export const Header = ({ onOpenOutputFolder, onResetSettings, outputsCount = 0 }) => {
  return (
    <header className="app-header">
      <div className="logo-badge">
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Film size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Auto Editor
            </h1>
            <span className="badge-916">9:16 REELS / TIKTOK</span>
          </div>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>
            Personal Local-First Video Automation (1080 × 1920)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="btn-secondary"
          onClick={onOpenOutputFolder}
          title="Open exported MP4 folder in Windows Explorer"
        >
          <FolderOpen size={16} />
          <span>Outputs {outputsCount > 0 && `(${outputsCount})`}</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onResetSettings}
          title="Reset to default template presets"
          style={{ padding: '10px' }}
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
};
