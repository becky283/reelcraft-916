import React from 'react';
import { SunMedium, Sparkles } from 'lucide-react';

const GRADIENT_COLOR_PRESETS = [
  { name: 'Pure Black', color: '#000000' },
  { name: 'Deep Navy', color: '#0a192f' },
  { name: 'Golf Dark Green', color: '#041f0e' },
  { name: 'Dark Slate', color: '#0f172a' },
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
        <SunMedium size={16} style={{ color: '#d97706' }} />
        <span>Gradient Fades & Blankspace</span>
      </div>

      {/* Blurred Video Backdrop Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #cbd5e1',
        boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="backdrop-toggle"
            checked={backdropBlur}
            onChange={(e) => onChangeBackdropBlur(e.target.checked)}
            style={{ width: '15px', height: '15px', accentColor: '#d97706', cursor: 'pointer' }}
          />
          <div>
            <label htmlFor="backdrop-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '12.5px', fontWeight: 700, color: '#0a192f' }}>
              Auto Blurred Mirror Background
            </label>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
              Menghilangkan blank space kosong di atas/bawah
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade Height (Primary) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>
            Bottom Gradient Height (Naik/Turun)
          </label>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 600,
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
                background: bottomGradientHeight === p.height ? 'rgba(245, 158, 11, 0.15)' : '#ffffff',
                border: bottomGradientHeight === p.height ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                color: bottomGradientHeight === p.height ? '#b45309' : '#334155',
                padding: '2px 7px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: 700,
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
          <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>Top Gradient Height</label>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 600,
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
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
