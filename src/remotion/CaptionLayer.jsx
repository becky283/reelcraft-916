import React from 'react';
import { getFontFamily } from './fonts';

/**
 * Calculates adaptive font size based on text length, target width, and target height.
 */
function calculateAdaptiveFontSize(text, baseSize = 64, minSize = 34, maxWidth = 880, maxHeight = 480) {
  if (!text) return baseSize;
  
  // Strip formatting brackets if any for length calculation
  const cleanText = text.replace(/[*[\]]/g, '');
  const charCount = cleanText.length;
  const words = cleanText.trim().split(/\s+/);
  const longestWordLength = Math.max(...words.map(w => w.length), 0);

  let size = baseSize;
  
  const estWordWidth = longestWordLength * (size * 0.62);
  if (estWordWidth > maxWidth) {
    size = Math.floor(maxWidth / (longestWordLength * 0.62));
  }

  const approxLines = Math.max(1, Math.ceil((charCount * (size * 0.62)) / maxWidth));
  const approxHeight = approxLines * (size * 1.3);

  if (approxHeight > maxHeight) {
    const scaleFactor = Math.sqrt(maxHeight / approxHeight);
    size = Math.floor(size * scaleFactor);
  }

  return Math.max(minSize, Math.min(baseSize, size));
}

/**
 * Splits text by multi-term highlight queries or brackets (*phrase* / [phrase])
 */
export function parseHighlightedText(text, highlightInput) {
  if (!text) return [];

  // 1. Check for markdown asterisks *text* or brackets [text]
  if (/\*([^*]+)\*/.test(text) || /\[([^\]]+)\]/.test(text)) {
    const tokens = [];
    const regex = /(\*([^*]+)\*|\[([^\]]+)\])/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: text.slice(lastIndex, match.index), isHighlight: false });
      }
      tokens.push({ text: match[2] || match[3], isHighlight: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ text: text.slice(lastIndex), isHighlight: false });
    }
    return tokens.filter(t => t.text.length > 0);
  }

  // 2. Parse multi-phrase list (from array, or comma-separated string)
  let terms = [];
  if (Array.isArray(highlightInput)) {
    terms = highlightInput.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof highlightInput === 'string' && highlightInput.trim()) {
    terms = highlightInput.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  }

  if (terms.length === 0) {
    return [{ text, isHighlight: false }];
  }

  // Sort longest terms first so multi-word phrases match before single words
  terms.sort((a, b) => b.length - a.length);

  const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const combinedRegex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const parts = text.split(combinedRegex);
  return parts
    .filter(p => p.length > 0)
    .map(p => {
      const lowerP = p.toLowerCase();
      const isMatch = terms.some(t => t.toLowerCase() === lowerP);
      return { text: p, isHighlight: isMatch };
    });
}

export const CaptionLayer = ({
  caption = '',
  highlightText = '',
  highlightWords = [],
  font = 'Montserrat ExtraBold',
  fontSize = 64,
  minFontSize = 34,
  defaultColor = '#FFFFFF',
  highlightColor = '#FFD600',
  align = 'center',
  textShadow = '0px 4px 16px rgba(0,0,0,0.95), 0px 2px 6px rgba(0,0,0,0.9)',
  textStroke = 'none',
  x = 100,
  y = 1400,
  width = 880,
  maxHeight = 500,
  lineHeight = 1.25,
  uppercase = true
}) => {
  const displayText = uppercase ? caption.toUpperCase() : caption;
  
  // Combine highlightWords array and highlightText string
  let terms = [];
  if (Array.isArray(highlightWords) && highlightWords.length > 0) {
    terms = [...highlightWords];
  }
  if (highlightText) {
    const extra = typeof highlightText === 'string' 
      ? highlightText.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
      : (Array.isArray(highlightText) ? highlightText : [highlightText]);
    terms = [...terms, ...extra];
  }

  if (uppercase) {
    terms = terms.map(t => t.toUpperCase());
  }

  const calculatedFontSize = calculateAdaptiveFontSize(
    displayText,
    fontSize,
    minFontSize,
    width,
    maxHeight
  );

  const segments = parseHighlightedText(displayText, terms);
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
