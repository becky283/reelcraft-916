import React, { useRef } from 'react';
import { Layers, Image, UploadCloud, MoveVertical, Maximize2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const LOGO_SIZE_PRESETS = [
  { label: 'Small', width: 140 },
  { label: 'Medium', width: 240 },
  { label: 'Large', width: 360 },
  { label: 'Extra Large', width: 480 },
];

export const BrandingControls = ({
  twibbonEnabled,
  onToggleTwibbon,
  twibbonSrc,
  onRemoveTwibbon,
  logoEnabled,
  onToggleLogo,
  logoSrc,
  onRemoveLogo,
  onUploadAsset,
  logoWidth = 240,
  onChangeLogoWidth,
  logoY = 980,
  onChangeLogoY,
  logoX,
  onChangeLogoX,
}) => {
  const logoInputRef = useRef(null);
  const twibbonInputRef = useRef(null);

  const hasTwibbon = Boolean(twibbonSrc && twibbonSrc.trim());
  const hasLogo = Boolean(logoSrc && logoSrc.trim());

  return (
    <div className="control-card">
      <div className="card-title">
        <Layers size={16} />
        <span>Branding & Overlays (Twibbon & Logo)</span>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 1. Twibbon Frame Control Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'var(--bg-input)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="twibbon-toggle"
                checked={twibbonEnabled && hasTwibbon}
                onChange={(e) => onToggleTwibbon(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
                disabled={!hasTwibbon}
              />
              <div>
                <label htmlFor="twibbon-toggle" style={{ margin: 0, cursor: hasTwibbon ? 'pointer' : 'default', fontSize: '13px', fontWeight: 700 }}>
                  9:16 Twibbon / Frame
                </label>
                <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>
                  {hasTwibbon ? (twibbonEnabled ? '🟢 Aktif (Menempel di atas video)' : '⚪ Dimatikan / Disembunyikan') : '❌ Belum ada twibbon'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '5px 8px', fontSize: '11px' }}
                onClick={() => twibbonInputRef.current?.click()}
                title="Ganti / Upload Twibbon Baru"
              >
                <UploadCloud size={12} /> {hasTwibbon ? 'Ganti' : 'Upload'}
              </button>

              {hasTwibbon && onRemoveTwibbon && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '5px 8px', fontSize: '11px', color: '#f87171' }}
                  onClick={() => {
                    if (window.confirm('Hapus twibbon dari video ini?')) {
                      onRemoveTwibbon();
                    }
                  }}
                  title="Hapus / Kosongkan Twibbon"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Logo Control Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'var(--bg-input)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="logo-toggle"
                checked={logoEnabled && hasLogo}
                onChange={(e) => onToggleLogo(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
                disabled={!hasLogo}
              />
              <div>
                <label htmlFor="logo-toggle" style={{ margin: 0, cursor: hasLogo ? 'pointer' : 'default', fontSize: '13px', fontWeight: 700 }}>
                  Brand Logo
                </label>
                <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>
                  {hasLogo ? (logoEnabled ? '🟢 Aktif (Badge di atas caption)' : '⚪ Dimatikan / Disembunyikan') : '❌ Belum ada logo'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '5px 8px', fontSize: '11px' }}
                onClick={() => logoInputRef.current?.click()}
                title="Ganti / Upload Logo Baru"
              >
                <UploadCloud size={12} /> {hasLogo ? 'Ganti' : 'Upload'}
              </button>

              {hasLogo && onRemoveLogo && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '5px 8px', fontSize: '11px', color: '#f87171' }}
                  onClick={() => {
                    if (window.confirm('Hapus logo dari video ini?')) {
                      onRemoveLogo();
                    }
                  }}
                  title="Hapus / Kosongkan Logo"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>

          {hasLogo && logoEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
              {/* Logo Size / Scale Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ margin: 0, fontSize: '12px' }}>
                    <Maximize2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Logo Size (Width)
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
                    {logoWidth}px
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min="60"
                    max="600"
                    step="10"
                    value={logoWidth}
                    onChange={(e) => onChangeLogoWidth(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#6366f1' }}
                  />
                  <button
                    type="button"
                    onClick={() => onChangeLogoWidth(240)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Reset (240px)
                  </button>
                </div>

                {/* Size Presets Chips */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {LOGO_SIZE_PRESETS.map((p) => (
                    <button
                      key={p.width}
                      type="button"
                      onClick={() => onChangeLogoWidth(p.width)}
                      style={{
                        background: logoWidth === p.width ? '#374151' : 'rgba(255,255,255,0.05)',
                        border: logoWidth === p.width ? '1px solid #818cf8' : '1px solid var(--border-color)',
                        color: logoWidth === p.width ? '#fff' : '#9ca3af',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Y Position Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ margin: 0, fontSize: '12px' }}>
                    <MoveVertical size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Logo Vertical Position (Y)
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
                    {logoY}px
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min="100"
                    max="1600"
                    step="10"
                    value={logoY}
                    onChange={(e) => onChangeLogoY(Number(e.target.value))}
                    style={{ flex: 1, accentColor: '#6366f1' }}
                  />
                  <button
                    type="button"
                    onClick={() => onChangeLogoY(980)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Reset (980px)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
