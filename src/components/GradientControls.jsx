import React from 'react';
import { SunMedium, Sparkles } from 'lucide-react';

const GRADIENT_COLOR_PRESETS = [
  { name: 'Pure Black', color: '#000000' },
  { name: 'Golf Dark Green', color: '#041f0e' },
  { name: 'Dark Slate', color: '#0f172a' },
  { name: 'Deep Navy', color: '#061224' },
  { name: 'Dark Purple', color: '#18072b' },
  { name: 'Dark Red', color: '#240808' },
];

const BOTTOM_HEIGHT_PRESETS = [
  { label: 'Subtle', height: 350 },
  { label: 'Medium', height: 550 },
  { label: 'High', height: 700 },
  { label: 'Extra High', height: 950 },
];

export const GradientControls = ({
  topGradientHeight,
  onChangeTopGradientHeight,
  bottomGradientHeight = 650,
  onChangeBottomGradientHeight,
  gradientColor,
  onChangeGradientColor,
  gradientOpacity,
  onChangeGradientOpacity,
  backdropBlur,
  onChangeBackdropBlur,
}) => {
  return (
    <div className="control-card">
      <div className="card-title">
        <SunMedium size={15} />
        <span>Gradient Fades & Blankspace</span>
      </div>

      {/* Blurred Video Backdrop Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.025)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-specular-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="backdrop-toggle"
            checked={backdropBlur}
            onChange={(e) => onChangeBackdropBlur(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#6366f1', cursor: 'pointer' }}
          />
          <div>
            <label htmlFor="backdrop-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '12.5px', fontWeight: 600 }}>
              Auto Blurred Mirror Background
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block' }}>
              Menghilangkan blank space kosong di atas/bawah
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade Height (Primary) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0, fontWeight: 600 }}>
            Bottom Gradient Height (Naik/Turun)
          </label>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#a5b4fc' }}>
            {bottomGradientHeight}px
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="0"
            max="1200"
            step="10"
            value={bottomGradientHeight}
            onChange={(e) => onChangeBottomGradientHeight(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChangeBottomGradientHeight(650)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Default (650px)
          </button>
        </div>

        {/* Quick Height Preset Chips */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          {BOTTOM_HEIGHT_PRESETS.map((p) => (
            <button
              key={p.height}
              type="button"
              onClick={() => onChangeBottomGradientHeight(p.height)}
              style={{
                background: bottomGradientHeight === p.height ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                border: bottomGradientHeight === p.height ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--glass-border)',
                color: bottomGradientHeight === p.height ? '#fff' : 'var(--text-muted)',
                padding: '2px 7px',
                borderRadius: '5px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {p.label} ({p.height}px)
            </button>
          ))}
        </div>
      </div>

      {/* Top Gradient Fade Height */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0 }}>Top Gradient Height</label>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#a5b4fc' }}>
            {topGradientHeight}px
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="0"
            max="800"
            step="10"
            value={topGradientHeight}
            onChange={(e) => onChangeTopGradientHeight(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChangeTopGradientHeight(0)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            0px (Off)
          </button>
        </div>
      </div>

      {/* Gradient Color & Opacity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Color */}
        <div>
          <label>Warna Gradasi</label>
          <div className="color-picker-row">
            <div className="color-input-wrapper" style={{ backgroundColor: gradientColor }}>
              <input
                type="color"
                value={gradientColor}
                onChange={(e) => onChangeGradientColor(e.target.value)}
              />
            </div>
            <div className="color-presets">
              {GRADIENT_COLOR_PRESETS.map((p) => (
                <div
                  key={p.color}
                  className="preset-chip"
                  style={{ backgroundColor: p.color }}
                  onClick={() => onChangeGradientColor(p.color)}
                  title={p.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ margin: 0 }}>Intensitas</label>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#a5b4fc' }}>
              {Math.round((gradientOpacity ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={gradientOpacity ?? 1}
            onChange={(e) => onChangeGradientOpacity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
