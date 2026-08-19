import React from 'react';

/**
 * Helper to convert hex or color string to rgba
 */
function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
    // If already rgba, replace alpha
    const parts = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (parts) {
      return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${alpha})`;
    }
    return hex;
  }
  
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

/**
 * Generates an ultra-smooth multi-stop scrim gradient (cubic easing curve)
 * to completely eliminate harsh linear lines or stiffness.
 */
function createSmoothGradient(direction, color, maxOpacity = 1.0) {
  const steps = 14;
  const stops = [];
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps; // 0 (start/solid) -> 1 (end/transparent)
    // Smooth cinematic cubic-cosine easing curve
    const ease = Math.pow(Math.cos(progress * (Math.PI / 2)), 2.4);
    const alpha = Math.max(0, Math.min(1, ease * maxOpacity));
    const percent = Math.round(progress * 1000) / 10;
    const rgba = hexToRgba(color, Math.round(alpha * 1000) / 1000);
    stops.push(`${rgba} ${percent}%`);
  }
  
  return `linear-gradient(${direction}, ${stops.join(', ')})`;
}

export const GradientLayer = ({
  topHeight = 0, // in px (0 - 600)
  bottomHeight = 350, // in px (0 - 800)
  color = '#000000',
  opacity = 1.0,
}) => {
  const topGradient = createSmoothGradient('to bottom', color, opacity);
  const bottomGradient = createSmoothGradient('to top', color, opacity);

  return (
    <>
      {/* Top Gradient Fade (Buttery Smooth Easing) */}
      {topHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1080px',
            height: `${topHeight}px`,
            background: topGradient,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}

      {/* Bottom Gradient Fade (Buttery Smooth Easing) */}
      {bottomHeight > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '1080px',
            height: `${bottomHeight}px`,
            background: bottomGradient,
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />
      )}
    </>
  );
};
