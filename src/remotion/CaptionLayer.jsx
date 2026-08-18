import React from 'react';
import { getFontFamily } from './fonts';

/**
 * Calculates adaptive font size based on text length, target width, and target height.
 */
function calculateAdaptiveFontSize(text, baseSize = 64, minSize = 34, maxWidth = 880, maxHeight = 480) {
  if (!text) return baseSize;
  
  const charCount = text.length;
  const words = text.trim().split(/\s+/);
  const longestWordLength = Math.max(...words.map(w => w.length), 0);

  // If a single word is extremely long, reduce font size to prevent overflow
  let size = baseSize;
  
  // Approximate width per character for bold uppercase font is ~0.6 * fontSize
  const estWordWidth = longestWordLength * (size * 0.62);
  if (estWordWidth > maxWidth) {
    size = Math.floor(maxWidth / (longestWordLength * 0.62));
  }

  // Approximate total area needed
  // Total characters * char_width * line_height
  // lines approx = (charCount * size * 0.6) / maxWidth
  // totalHeight approx = lines * (size * 1.25)
  const approxLines = Math.max(1, Math.ceil((charCount * (size * 0.62)) / maxWidth));
  const approxHeight = approxLines * (size * 1.3);

  if (approxHeight > maxHeight) {
    const scaleFactor = Math.sqrt(maxHeight / approxHeight);
    size = Math.floor(size * scaleFactor);
  }

  // Clamp within bounds
  return Math.max(minSize, Math.min(baseSize, size));
}

/**
 * Splits text by highlight queries and marks matching segments
 */
export function parseHighlightedText(text, highlightQuery) {
  if (!text) return [];
  if (!highlightQuery || !highlightQuery.trim()) {
    return [{ text, isHighlight: false }];
  }

  const query = highlightQuery.trim();
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(part => part.length > 0)
    .map(part => ({
      text: part,
      isHighlight: part.toLowerCase() === query.toLowerCase()
    }));
}

export const CaptionLayer = ({
  caption = '',
  highlightText = '',
  font = 'Montserrat ExtraBold',
  fontSize = 64,
  minFontSize = 34,
  defaultColor = '#FFFFFF',
  highlightColor = '#FFD600',
  align = 'center',
  textShadow = '0px 4px 16px rgba(0,0,0,0.95), 0px 2px 6px rgba(0,0,0,0.9)',
  textStroke = 'none', // e.g. '2px #000000'
  x = 100,
  y = 1120,
  width = 880,
  maxHeight = 500,
  lineHeight = 1.25,
  uppercase = true
}) => {
  const displayText = uppercase ? caption.toUpperCase() : caption;
  const displayHighlight = uppercase ? highlightText.toUpperCase() : highlightText;
  
  const calculatedFontSize = calculateAdaptiveFontSize(
    displayText,
    fontSize,
    minFontSize,
    width,
    maxHeight
  );

  const segments = parseHighlightedText(displayText, displayHighlight);
  const fontFamily = getFontFamily(font);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        maxHeight: `${maxHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        textAlign: align,
        fontFamily,
        fontSize: `${calculatedFontSize}px`,
        fontWeight: 800,
        lineHeight: lineHeight,
        letterSpacing: '0.02em',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        textShadow: textShadow || 'none',
        WebkitTextStroke: textStroke !== 'none' ? textStroke : undefined,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div>
        {segments.map((seg, idx) => (
          <span
            key={idx}
            style={{
              color: seg.isHighlight ? highlightColor : defaultColor,
              display: 'inline',
              transition: 'color 0.15s ease',
            }}
          >
            {seg.text}
          </span>
        ))}
      </div>
    </div>
  );
};
