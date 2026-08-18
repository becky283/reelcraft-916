import React from 'react';
import { Sliders, AlignLeft, AlignCenter, AlignRight, ShieldCheck } from 'lucide-react';
import { AVAILABLE_FONTS } from '../remotion/fonts';

export const StyleControls = ({
  font,
  onChangeFont,
  fontSize,
  onChangeFontSize,
  align,
  onChangeAlign,
}) => {
  return (
    <div className="control-card">
      <div className="card-title">
        <Sliders size={16} />
        <span>Typography & Layout</span>
      </div>

      {/* Font Selector */}
      <div>
        <label>Font Family</label>
        <select
          value={font}
          onChange={(e) => onChangeFont(e.target.value)}
          style={{ fontWeight: 600 }}
        >
          {AVAILABLE_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
          Drop custom .ttf/.otf files into <code>assets/fonts/</code> anytime.
        </span>
      </div>

      {/* Font Size & Alignment Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Base Font Size */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ margin: 0 }}>Base Size</label>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
              {fontSize}px
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="80"
            step="2"
            value={fontSize}
            onChange={(e) => onChangeFontSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
        </div>

        {/* Alignment */}
        <div>
          <label>Text Align</label>
          <div className="segmented-group">
            <button
              type="button"
              className={`segment-btn ${align === 'left' ? 'active' : ''}`}
              onClick={() => onChangeAlign('left')}
              title="Align Left"
            >
              <AlignLeft size={16} style={{ verticalAlign: 'middle' }} />
            </button>
            <button
              type="button"
              className={`segment-btn ${align === 'center' ? 'active' : ''}`}
              onClick={() => onChangeAlign('center')}
              title="Align Center"
            >
              <AlignCenter size={16} style={{ verticalAlign: 'middle' }} />
            </button>
            <button
              type="button"
              className={`segment-btn ${align === 'right' ? 'active' : ''}`}
              onClick={() => onChangeAlign('right')}
              title="Align Right"
            >
              <AlignRight size={16} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Safe Area Auto-Shrink Guarantee Note */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
      }}>
        <ShieldCheck size={16} style={{ color: '#818cf8', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '11.5px', color: '#c7d2fe', lineHeight: 1.4 }}>
          <strong>Auto Safe-Area Guard:</strong> If caption text exceeds safe boundaries, font size will dynamically scale down (64px → 58px → 52px → 46px) so it never overflows.
        </span>
      </div>
    </div>
  );
};
