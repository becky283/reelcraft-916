import React from 'react';
import { Crop, MoveVertical, Maximize2, Minimize2 } from 'lucide-react';

export const VideoFitControls = ({
  fit,
  onChangeFit,
  verticalAlign,
  onChangeVerticalAlign,
}) => {
  return (
    <div className="control-card">
      <div className="card-title">
        <Crop size={16} />
        <span>Video Framing & Fit</span>
      </div>

      {/* Fit Mode */}
      <div>
        <label>Slot Fit Mode</label>
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

      {/* Vertical Positioning */}
      <div>
        <label>
          <MoveVertical size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          Vertical Alignment (Framing)
        </label>
        <div className="segmented-group">
          <button
            type="button"
            className={`segment-btn ${verticalAlign === 'top' ? 'active' : ''}`}
            onClick={() => onChangeVerticalAlign('top')}
          >
            Top Align
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
            Bottom Align
          </button>
        </div>
      </div>
    </div>
  );
};
