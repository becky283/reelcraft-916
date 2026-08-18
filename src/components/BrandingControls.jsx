import React, { useRef } from 'react';
import { Layers, Image, UploadCloud } from 'lucide-react';

export const BrandingControls = ({
  twibbonEnabled,
  onToggleTwibbon,
  twibbonSrc,
  logoEnabled,
  onToggleLogo,
  logoSrc,
  onUploadAsset,
}) => {
  const logoInputRef = useRef(null);
  const twibbonInputRef = useRef(null);

  return (
    <div className="control-card">
      <div className="card-title">
        <Layers size={16} />
        <span>Branding & Overlays</span>
      </div>

      <input
        type="file"
        ref={logoInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) onUploadAsset(e.target.files[0], 'logo');
        }}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        style={{ display: 'none' }}
      />

      <input
        type="file"
        ref={twibbonInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) onUploadAsset(e.target.files[0], 'twibbon');
        }}
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Twibbon Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-input)',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="twibbon-toggle"
              checked={twibbonEnabled}
              onChange={(e) => onToggleTwibbon(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div>
              <label htmlFor="twibbon-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '13px' }}>
                9:16 Twibbon / Frame
              </label>
              <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>
                1080×1920 overlay PNG
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => twibbonInputRef.current?.click()}
          >
            <UploadCloud size={12} /> Replace
          </button>
        </div>

        {/* Logo Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-input)',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="logo-toggle"
              checked={logoEnabled}
              onChange={(e) => onToggleLogo(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div>
              <label htmlFor="logo-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '13px' }}>
                Brand Logo
              </label>
              <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>
                Center badge above caption
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '11px' }}
            onClick={() => logoInputRef.current?.click()}
          >
            <UploadCloud size={12} /> Replace
          </button>
        </div>
      </div>
    </div>
  );
};
