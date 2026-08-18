import React from 'react';
import { Type, Highlighter, Palette, Sparkles } from 'lucide-react';
import { parseHighlightedText } from '../remotion/CaptionLayer';

const DEFAULT_COLOR_PRESETS = [
  '#FFFFFF',
  '#F3F4F6',
  '#E5E7EB',
  '#FFED4A',
  '#38BDF8',
  '#F87171',
];

const HIGHLIGHT_COLOR_PRESETS = [
  '#FFD600', // Iconic Bright Yellow
  '#00FF66', // Neon Lime Green
  '#00E5FF', // Electric Cyan
  '#FF2A85', // Neon Hot Pink
  '#FF8800', // Vibrant Orange
  '#FFFFFF', // Clean White
];

export const CaptionEditor = ({
  caption,
  onChangeCaption,
  highlightText,
  onChangeHighlight,
  defaultColor,
  onChangeDefaultColor,
  highlightColor,
  onChangeHighlightColor,
  uppercase = true,
  onToggleUppercase,
  textStroke,
  onChangeTextStroke,
}) => {
  const displayText = uppercase ? caption.toUpperCase() : caption;
  const displayHighlight = uppercase ? highlightText.toUpperCase() : highlightText;
  const previewSegments = parseHighlightedText(displayText, displayHighlight);

  return (
    <div className="control-card">
      <div className="card-title">
        <Type size={16} />
        <span>Caption & Headline</span>
      </div>

      {/* Caption Textarea */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>Caption / Headline</label>
          <button
            type="button"
            onClick={() => onToggleUppercase(!uppercase)}
            style={{
              background: uppercase ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: uppercase ? '1px solid #6366f1' : '1px solid var(--border-color)',
              color: uppercase ? '#818cf8' : '#9ca3af',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {uppercase ? 'UPPERCASE ON' : 'UPPERCASE OFF'}
          </button>
        </div>
        <textarea
          value={caption}
          onChange={(e) => onChangeCaption(e.target.value)}
          placeholder="e.g. JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!"
          rows={3}
        />
      </div>

      {/* Highlight Phrase */}
      <div>
        <label>
          <Highlighter size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          Highlight Text / Words
        </label>
        <input
          type="text"
          value={highlightText}
          onChange={(e) => onChangeHighlight(e.target.value)}
          placeholder="e.g. JIM CRAMER: or BITCOIN"
        />
        <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
          Matching words will automatically receive the highlight color below.
        </span>
      </div>

      {/* Live Text Breakdown Badge */}
      {caption && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', color: '#9ca3af', width: '100%', marginBottom: '2px' }}>
            Live Highlight Preview:
          </span>
          {previewSegments.map((seg, idx) => (
            <span
              key={idx}
              style={{
                color: seg.isHighlight ? highlightColor : defaultColor,
                backgroundColor: seg.isHighlight ? 'rgba(255, 214, 0, 0.15)' : 'transparent',
                padding: seg.isHighlight ? '1px 5px' : '0',
                borderRadius: '4px',
                border: seg.isHighlight ? `1px solid ${highlightColor}40` : 'none',
              }}
            >
              {seg.text}
            </span>
          ))}
        </div>
      )}

      {/* Color Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Default Color */}
        <div>
          <label>Default Text Color</label>
          <div className="color-picker-row">
            <div className="color-input-wrapper" style={{ backgroundColor: defaultColor }}>
              <input
                type="color"
                value={defaultColor}
                onChange={(e) => onChangeDefaultColor(e.target.value)}
              />
            </div>
            <div className="color-presets">
              {DEFAULT_COLOR_PRESETS.map((color) => (
                <div
                  key={color}
                  className="preset-chip"
                  style={{ backgroundColor: color }}
                  onClick={() => onChangeDefaultColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Color */}
        <div>
          <label>Highlight Color</label>
          <div className="color-picker-row">
            <div className="color-input-wrapper" style={{ backgroundColor: highlightColor }}>
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => onChangeHighlightColor(e.target.value)}
              />
            </div>
            <div className="color-presets">
              {HIGHLIGHT_COLOR_PRESETS.map((color) => (
                <div
                  key={color}
                  className="preset-chip"
                  style={{ backgroundColor: color }}
                  onClick={() => onChangeHighlightColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text Outline Effect */}
      <div>
        <label>Text Outline / Stroke</label>
        <div className="segmented-group">
          <button
            type="button"
            className={`segment-btn ${textStroke === 'none' ? 'active' : ''}`}
            onClick={() => onChangeTextStroke('none')}
          >
            None (Clean)
          </button>
          <button
            type="button"
            className={`segment-btn ${textStroke === '2px #000000' ? 'active' : ''}`}
            onClick={() => onChangeTextStroke('2px #000000')}
          >
            Subtle 2px
          </button>
          <button
            type="button"
            className={`segment-btn ${textStroke === '4px #000000' ? 'active' : ''}`}
            onClick={() => onChangeTextStroke('4px #000000')}
          >
            Bold 4px
          </button>
        </div>
      </div>
    </div>
  );
};
