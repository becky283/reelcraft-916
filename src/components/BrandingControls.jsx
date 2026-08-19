import React, { useRef } from 'react';
import { Layers, Image, UploadCloud, MoveVertical, Maximize2, Trash2, CheckCircle2 } from 'lucide-react';

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
        <Layers size={16} style={{ color: '#d97706' }} />
        <span>Branding Overlays</span>
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
        {/* 1. Twibbon Frame Control Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="twibbon-toggle"
                checked={twibbonEnabled && hasTwibbon}
                onChange={(e) => onToggleTwibbon(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#d97706', cursor: 'pointer' }}
                disabled={!hasTwibbon}
              />
              <div>
                <label htmlFor="twibbon-toggle" style={{ margin: 0, cursor: hasTwibbon ? 'pointer' : 'default', fontSize: '13px', fontWeight: 700, color: '#0a192f' }}>
                  9:16 Twibbon / Frame
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                  {hasTwibbon ? (twibbonEnabled ? '🟢 Aktif' : '⚪ Disembunyikan') : '❌ Belum ada file'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => twibbonInputRef.current?.click()}
                title="Ganti / Upload Twibbon Baru"
              >
                <UploadCloud size={12} style={{ color: '#d97706' }} /> {hasTwibbon ? 'Ganti' : 'Upload'}
              </button>

              {hasTwibbon && onRemoveTwibbon && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', color: '#e11d48' }}
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
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="logo-toggle"
                checked={logoEnabled && hasLogo}
                onChange={(e) => onToggleLogo(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: '#d97706', cursor: 'pointer' }}
                disabled={!hasLogo}
              />
              <div>
                <label htmlFor="logo-toggle" style={{ margin: 0, cursor: hasLogo ? 'pointer' : 'default', fontSize: '13px', fontWeight: 700, color: '#0a192f' }}>
                  Brand Logo
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                  {hasLogo ? (logoEnabled ? '🟢 Aktif' : '⚪ Disembunyikan') : '❌ Belum ada file'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => logoInputRef.current?.click()}
                title="Ganti / Upload Logo Baru"
              >
                <UploadCloud size={12} style={{ color: '#d97706' }} /> {hasLogo ? 'Ganti' : 'Upload'}
              </button>

              {hasLogo && onRemoveLogo && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', color: '#e11d48' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              {/* Logo Size / Scale Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ margin: 0, fontSize: '11.5px' }}>
                    <Maximize2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
                    Ukuran Logo (Width)
                  </label>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => onChangeLogoWidth(240)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
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
                        background: logoWidth === p.width ? 'rgba(245, 158, 11, 0.15)' : '#ffffff',
                        border: logoWidth === p.width ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                        color: logoWidth === p.width ? '#b45309' : '#334155',
                        padding: '2px 7px',
                        borderRadius: '5px',
                        fontSize: '11px',
                        fontWeight: 700,
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
                  <label style={{ margin: 0, fontSize: '11.5px' }}>
                    <MoveVertical size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
                    Posisi Vertikal Logo (Y)
                  </label>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => onChangeLogoY(980)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
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
