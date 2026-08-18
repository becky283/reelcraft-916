import React from 'react';
import { Crop, MoveVertical, Maximize2, Minimize2, Sliders, Smartphone, LayoutTemplate, RotateCcw } from 'lucide-react';

export const VideoFitControls = ({
  fit,
  onChangeFit,
  verticalAlign,
  onChangeVerticalAlign,
  videoY,
  onChangeVideoY,
  videoHeight,
  onChangeVideoHeight,
  videoScale,
  onChangeVideoScale,
}) => {
  // Preset Layout Handlers
  const applyPreset = (preset) => {
    switch (preset) {
      case 'fullscreen':
        onChangeVideoY(0);
        onChangeVideoHeight(1920);
        onChangeVideoScale(1.0);
        onChangeFit('cover');
        onChangeVerticalAlign('center');
        break;
      case 'top':
        onChangeVideoY(0);
        onChangeVideoHeight(960);
        onChangeVideoScale(1.0);
        onChangeFit('cover');
        onChangeVerticalAlign('top');
        break;
      case 'upper':
        onChangeVideoY(120);
        onChangeVideoHeight(860);
        onChangeVideoScale(1.0);
        onChangeFit('cover');
        onChangeVerticalAlign('center');
        break;
      case 'center':
        onChangeVideoY(300);
        onChangeVideoHeight(750);
        onChangeVideoScale(1.0);
        onChangeFit('cover');
        onChangeVerticalAlign('center');
        break;
      default:
        break;
    }
  };

  return (
    <div className="control-card">
      <div className="card-title">
        <Crop size={16} />
        <span>Video Framing & Position</span>
      </div>

      {/* Quick Layout Presets */}
      <div>
        <label>Quick Layout Presets</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              background: videoY === 0 && videoHeight === 1920 ? '#374151' : 'var(--bg-input)',
              borderColor: videoY === 0 && videoHeight === 1920 ? '#818cf8' : 'var(--border-color)',
            }}
            onClick={() => applyPreset('fullscreen')}
          >
            <Smartphone size={14} /> Full 9:16 Screen
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              background: videoY === 0 && videoHeight === 960 ? '#374151' : 'var(--bg-input)',
              borderColor: videoY === 0 && videoHeight === 960 ? '#818cf8' : 'var(--border-color)',
            }}
            onClick={() => applyPreset('top')}
          >
            <LayoutTemplate size={14} /> Top Half
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              background: videoY === 120 && videoHeight === 860 ? '#374151' : 'var(--bg-input)',
              borderColor: videoY === 120 && videoHeight === 860 ? '#818cf8' : 'var(--border-color)',
            }}
            onClick={() => applyPreset('upper')}
          >
            Upper Box (Header)
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              background: videoY === 300 && videoHeight === 750 ? '#374151' : 'var(--bg-input)',
              borderColor: videoY === 300 && videoHeight === 750 ? '#818cf8' : 'var(--border-color)',
            }}
            onClick={() => applyPreset('center')}
          >
            Center Box
          </button>
        </div>
      </div>

      {/* Interactive Y-Position Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>
            <MoveVertical size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Video Y Position (Vertical Offset)
          </label>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
            {videoY}px
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="-200"
            max="1000"
            step="10"
            value={videoY}
            onChange={(e) => onChangeVideoY(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoY(0)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Y=0
          </button>
        </div>
      </div>

      {/* Video Slot Height Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>Video Frame Height</label>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
            {videoHeight}px {videoHeight === 1920 ? '(Full Height)' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="400"
            max="1920"
            step="20"
            value={videoHeight}
            onChange={(e) => onChangeVideoHeight(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoHeight(1920)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            1920px
          </button>
        </div>
      </div>

      {/* Zoom / Scale Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>Zoom / Scale</label>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
            {Math.round((videoScale || 1.0) * 100)}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={videoScale || 1.0}
            onChange={(e) => onChangeVideoScale(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#6366f1' }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoScale(1.0)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            100%
          </button>
        </div>
      </div>

      {/* Fit Mode */}
      <div>
        <label>Crop / Fit Mode</label>
        <div className="segmented-group">
          <button
            type="button"
            className={`segment-btn ${fit === 'cover' ? 'active' : ''}`}
            onClick={() => onChangeFit('cover')}
          >
            <Maximize2 size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Crop to Fill (Cover)
          </button>
          <button
            type="button"
            className={`segment-btn ${fit === 'contain' ? 'active' : ''}`}
            onClick={() => onChangeFit('contain')}
          >
            <Minimize2 size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Fit in Slot (Contain)
          </button>
        </div>
      </div>

      {/* Vertical Alignment */}
      <div>
        <label>Slot Crop Alignment</label>
        <div className="segmented-group">
          <button
            type="button"
            className={`segment-btn ${verticalAlign === 'top' ? 'active' : ''}`}
            onClick={() => onChangeVerticalAlign('top')}
          >
            Top
          </button>
          <button
            type="button"
            className={`segment-btn ${verticalAlign === 'center' ? 'active' : ''}`}
            onClick={() => onChangeVerticalAlign('center')}
          >
            Center
          </button>
          <button
            type="button"
            className={`segment-btn ${verticalAlign === 'bottom' ? 'active' : ''}`}
            onClick={() => onChangeVerticalAlign('bottom')}
          >
            Bottom
          </button>
        </div>
      </div>
    </div>
  );
};
