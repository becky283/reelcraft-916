import React from 'react';

/**
 * Helper to convert hex or color to rgba
 */
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(0,0,0,${alpha})`;
  
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const GradientLayer = ({
  topHeight = 0, // in px (0 - 600)
  bottomHeight = 350, // in px (0 - 800)
  color = '#000000',
  opacity = 1.0,
}) => {
  const solidColor = hexToRgba(color, opacity);
  const transparentColor = hexToRgba(color, 0);

  return (
    <>
      {/* Top Gradient Fade */}
      {topHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1080px',
            height: `${topHeight}px`,
            background: `linear-gradient(to bottom, ${solidColor} 0%, ${transparentColor} 100%)`,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {/* Bottom Gradient Fade */}
      {bottomHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '1080px',
            height: `${bottomHeight}px`,
            background: `linear-gradient(to top, ${solidColor} 0%, ${transparentColor} 100%)`,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}
    </>
  );
};
