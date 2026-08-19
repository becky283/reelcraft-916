import React from 'react';
import { Crop, MoveVertical, Maximize2, Minimize2, Smartphone, LayoutTemplate } from 'lucide-react';

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
        <Crop size={16} style={{ color: '#d97706' }} />
        <span>Video Framing & Position</span>
      </div>

      {/* Quick Layout Presets */}
      <div>
        <label>Preset Posisi Cepat</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '7px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              background: videoY === 0 && videoHeight === 1920 ? 'rgba(245, 158, 11, 0.15)' : undefined,
              borderColor: videoY === 0 && videoHeight === 1920 ? '#d97706' : undefined,
              color: videoY === 0 && videoHeight === 1920 ? '#b45309' : undefined,
            }}
            onClick={() => applyPreset('fullscreen')}
          >
            <Smartphone size={13} style={{ color: '#d97706' }} /> Full 9:16 Screen
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '7px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              background: videoY === 0 && videoHeight === 960 ? 'rgba(245, 158, 11, 0.15)' : undefined,
              borderColor: videoY === 0 && videoHeight === 960 ? '#d97706' : undefined,
              color: videoY === 0 && videoHeight === 960 ? '#b45309' : undefined,
            }}
            onClick={() => applyPreset('top')}
          >
            <LayoutTemplate size={13} style={{ color: '#d97706' }} /> Top Half
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '7px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              background: videoY === 120 && videoHeight === 860 ? 'rgba(245, 158, 11, 0.15)' : undefined,
              borderColor: videoY === 120 && videoHeight === 860 ? '#d97706' : undefined,
              color: videoY === 120 && videoHeight === 860 ? '#b45309' : undefined,
            }}
            onClick={() => applyPreset('upper')}
          >
            Upper Header Box
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '7px 10px',
              fontSize: '11.5px',
              fontWeight: 700,
              background: videoY === 300 && videoHeight === 750 ? 'rgba(245, 158, 11, 0.15)' : undefined,
              borderColor: videoY === 300 && videoHeight === 750 ? '#d97706' : undefined,
              color: videoY === 300 && videoHeight === 750 ? '#b45309' : undefined,
            }}
            onClick={() => applyPreset('center')}
          >
            Center Box
          </button>
        </div>
      </div>

      {/* Interactive Y-Position Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>
            <MoveVertical size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
            Posisi Vertikal Video (Y)
          </label>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoY(0)}
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
            Y=0
          </button>
        </div>
      </div>

      {/* Video Slot Height Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>Tinggi Slot Video</label>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
            {videoHeight}px {videoHeight === 1920 ? '(Full Screen)' : ''}
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
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoHeight(1920)}
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
            1920px
          </button>
        </div>
      </div>

      {/* Zoom / Scale Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <label style={{ margin: 0, fontWeight: 700, color: '#0a192f' }}>Zoom / Scale</label>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
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
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => onChangeVideoScale(1.0)}
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
            <Maximize2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Crop to Fill (Cover)
          </button>
          <button
            type="button"
            className={`segment-btn ${fit === 'contain' ? 'active' : ''}`}
            onClick={() => onChangeFit('contain')}
          >
            <Minimize2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
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
