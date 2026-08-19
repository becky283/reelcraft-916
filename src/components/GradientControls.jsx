import React from 'react';
import { SunMedium, Sparkles, Droplet, Eye, Blend } from 'lucide-react';

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
  { label: 'High (Optimal)', height: 700 },
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
        <SunMedium size={16} />
        <span>Gradient Fades & Blankspace Fill</span>
      </div>

      {/* Blurred Video Backdrop Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(99, 102, 241, 0.08)',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="backdrop-toggle"
            checked={backdropBlur}
            onChange={(e) => onChangeBackdropBlur(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
          />
          <div>
            <label htmlFor="backdrop-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#c7d2fe' }}>
              Auto Blurred Video Background
            </label>
            <span style={{ fontSize: '11px', color: '#9ca3af', display: 'block' }}>
              Eliminates empty blank space with a cinematic blurred mirror backdrop
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade Height (Primary) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0, fontWeight: 700, color: '#e0e7ff' }}>
            Bottom Gradient Fade Height (Naik/Turun)
          </label>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#818cf8' }}>
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
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
          <button
            type="button"
            onClick={() => onChangeBottomGradientHeight(650)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
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
                background: bottomGradientHeight === p.height ? '#374151' : 'rgba(255,255,255,0.05)',
                border: bottomGradientHeight === p.height ? '1px solid #818cf8' : '1px solid var(--border-color)',
                color: bottomGradientHeight === p.height ? '#fff' : '#9ca3af',
                padding: '3px 8px',
                borderRadius: '4px',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>Top Gradient Fade Height</label>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
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
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
          <button
            type="button"
            onClick={() => onChangeTopGradientHeight(0)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Color */}
        <div>
          <label>Gradient Color</label>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ margin: 0 }}>Fade Intensity</label>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
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
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
        </div>
      </div>
    </div>
  );
};
