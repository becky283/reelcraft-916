import React, { useMemo } from 'react';
import { Type, Highlighter, Palette, Sparkles, MoveVertical, MousePointerClick } from 'lucide-react';
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
  highlightWords = [],
  onChangeHighlightWords,
  highlightText = '',
  onChangeHighlightText,
  defaultColor,
  onChangeDefaultColor,
  highlightColor,
  onChangeHighlightColor,
  uppercase = true,
  onToggleUppercase,
  textStroke,
  onChangeTextStroke,
  captionY = 1400,
  onChangeCaptionY,
}) => {
  const displayText = uppercase ? caption.toUpperCase() : caption;

  // Extract unique words from caption for click-to-highlight
  const availableWords = useMemo(() => {
    if (!displayText) return [];
    return displayText.trim().split(/\s+/).filter(Boolean);
  }, [displayText]);

  // Check if a specific word from caption is currently highlighted
  const isWordHighlighted = (word) => {
    const cleanWord = word.trim().toLowerCase();
    if (highlightWords.some(w => w.trim().toLowerCase() === cleanWord)) {
      return true;
    }
    if (highlightText) {
      const parts = highlightText.split(/[,;\n]+/).map(s => s.trim().toLowerCase());
      if (parts.includes(cleanWord)) return true;
    }
    return false;
  };

  // Toggle word click
  const handleToggleWord = (word) => {
    const cleanWord = uppercase ? word.toUpperCase() : word;
    const exists = isWordHighlighted(word);

    let nextWords = [...highlightWords];
    if (exists) {
      nextWords = nextWords.filter(w => w.trim().toLowerCase() !== word.trim().toLowerCase());
      if (highlightText) {
        const parts = highlightText.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.toLowerCase() !== word.trim().toLowerCase());
        if (onChangeHighlightText) onChangeHighlightText(parts.join(', '));
      }
    } else {
      nextWords.push(cleanWord);
    }
    onChangeHighlightWords(nextWords);
  };

  // Clear all highlights
  const handleClearAll = () => {
    onChangeHighlightWords([]);
    if (onChangeHighlightText) onChangeHighlightText('');
  };

  // Highlight all words
  const handleHighlightAll = () => {
    onChangeHighlightWords([...availableWords]);
  };

  // Combined terms for live breakdown
  const combinedTerms = useMemo(() => {
    let terms = [...highlightWords];
    if (highlightText) {
      const extra = highlightText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      terms = [...terms, ...extra];
    }
    return uppercase ? terms.map(t => t.toUpperCase()) : terms;
  }, [highlightWords, highlightText, uppercase]);

  const previewSegments = parseHighlightedText(displayText, combinedTerms);

  return (
    <div className="control-card">
      <div className="card-title">
        <Type size={16} style={{ color: '#d97706' }} />
        <span>Caption & Word Highlighter</span>
      </div>

      {/* 1. Caption Textarea */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ margin: 0 }}>Caption / Headline Teks</label>
          <button
            type="button"
            onClick={() => onToggleUppercase(!uppercase)}
            style={{
              background: uppercase ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: uppercase ? '1px solid #d97706' : '1px solid #cbd5e1',
              color: uppercase ? '#b45309' : '#64748b',
              fontSize: '10.5px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
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

      {/* 2. Interactive Word-Click Highlighter */}
      {availableWords.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.06)',
          border: '1.5px solid rgba(217, 119, 6, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(217, 119, 6, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0a192f', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MousePointerClick size={14} style={{ color: '#d97706' }} />
              Klik Kata untuk Highlight Warna:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleClearAll}
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
                Reset
              </button>
              <button
                type="button"
                onClick={handleHighlightAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#d97706',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Pilih Semua
              </button>
            </div>
          </div>

          {/* Clickable Word Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
            {availableWords.map((word, idx) => {
              const active = isWordHighlighted(word);
              return (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => handleToggleWord(word)}
                  style={{
                    background: active ? '#f59e0b' : '#ffffff',
                    color: active ? '#0a192f' : '#334155',
                    border: active ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                    padding: '5px 10px',
                    borderRadius: '7px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: active ? '0 3px 12px rgba(217, 119, 6, 0.4)' : '0 1px 3px rgba(0,0,0,0.05)',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            💡 Klik kata mana saja yang ingin di-highlight warna (bisa acak / terpisah).
          </span>
        </div>
      )}

      {/* 3. Optional Comma-Separated Highlight Input */}
      <div>
        <label style={{ fontSize: '11.5px', color: '#64748b' }}>
          <Highlighter size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
          Atau Ketik Kata Highlight (pisahkan koma)
        </label>
        <input
          type="text"
          value={highlightText}
          onChange={(e) => {
            if (onChangeHighlightText) onChangeHighlightText(e.target.value);
          }}
          placeholder="e.g. JIM CRAMER, JUAL, TURUN"
          style={{ fontSize: '12.5px' }}
        />
      </div>

      {/* 4. Live Highlighted Text Preview */}
      {caption && (
        <div style={{
          background: '#0a192f',
          border: '1px solid #1e3a8a',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '13.5px',
          fontWeight: 700,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          alignItems: 'center',
          lineHeight: 1.4,
          boxShadow: '0 4px 14px rgba(10, 25, 47, 0.2)'
        }}>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', width: '100%', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Preview Headline:
          </span>
          {previewSegments.map((seg, idx) => (
            <span
              key={idx}
              style={{
                color: seg.isHighlight ? highlightColor : defaultColor,
                backgroundColor: seg.isHighlight ? `${highlightColor}30` : 'transparent',
                padding: seg.isHighlight ? '1px 6px' : '0',
                borderRadius: '4px',
                border: seg.isHighlight ? `1px solid ${highlightColor}70` : 'none',
              }}
            >
              {seg.text}
            </span>
          ))}
        </div>
      )}

      {/* 5. Color Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Default Color */}
        <div>
          <label>Warna Teks Biasa</label>
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
          <label>Warna Highlight</label>
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

      {/* 6. Caption Y Position Slider (If customizer is enabled) */}
      {onChangeCaptionY && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ margin: 0 }}>
              <MoveVertical size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#d97706' }} />
              Posisi Vertikal Caption (Y)
            </label>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309' }}>
              {captionY}px
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="400"
              max="1700"
              step="10"
              value={captionY}
              onChange={(e) => onChangeCaptionY(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => onChangeCaptionY(1400)}
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
              Reset (1400px)
            </button>
          </div>
        </div>
      )}

      {/* 7. Text Outline Effect */}
      <div>
        <label>Garis Tepi Teks (Outline / Stroke)</label>
        <div className="segmented-group">
          <button
            type="button"
            className={`segment-btn ${textStroke === 'none' ? 'active' : ''}`}
            onClick={() => onChangeTextStroke('none')}
          >
            None (Polos)
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
