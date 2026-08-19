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
        <Sliders size={16} style={{ color: '#d97706' }} />
        <span>Typography & Layout</span>
      </div>

      {/* Font Selector */}
      <div>
        <label>Font Family</label>
        <select
          value={font}
          onChange={(e) => onChangeFont(e.target.value)}
          style={{ fontWeight: 700, color: '#0a192f' }}
        >
          {AVAILABLE_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
          File font kustom ada di folder <code>assets/fonts/</code>.
        </span>
      </div>

      {/* Font Size & Alignment Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Base Font Size */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>Ukuran Font</label>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
            style={{ width: '100%' }}
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
              <AlignLeft size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button
              type="button"
              className={`segment-btn ${align === 'center' ? 'active' : ''}`}
              onClick={() => onChangeAlign('center')}
              title="Align Center"
            >
              <AlignCenter size={14} style={{ verticalAlign: 'middle' }} />
            </button>
            <button
              type="button"
              className={`segment-btn ${align === 'right' ? 'active' : ''}`}
              onClick={() => onChangeAlign('right')}
              title="Align Right"
            >
              <AlignRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Safe Area Auto-Shrink Guarantee Note */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(217, 119, 6, 0.25)',
        borderRadius: 'var(--radius-sm)',
        padding: '9px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
      }}>
        <ShieldCheck size={14} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '11.5px', color: '#0a192f', lineHeight: 1.4, fontWeight: 500 }}>
          <strong style={{ color: '#b45309' }}>Auto Safe-Area Guard:</strong> Jika teks caption panjang, font otomatis mengecil dinamis agar tidak terpotong tepi layar.
        </span>
      </div>
    </div>
  );
};
