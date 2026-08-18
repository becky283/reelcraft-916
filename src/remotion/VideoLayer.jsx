import React from 'react';
import { Video } from 'remotion';

export function resolveMediaSrc(src) {
  if (!src) return '';
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('blob:') ||
    src.startsWith('data:')
  ) {
    return src;
  }
  
  // Point directly to Express backend port 3001 for high-performance direct byte streaming
  const clean = src.startsWith('/') ? src : `/${src}`;
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || '127.0.0.1';
    return `http://${host}:3001${clean}`;
  }
  return `http://127.0.0.1:3001${clean}`;
}

export const VideoLayer = ({
  src,
  x = 0,
  y = 0,
  width = 1080,
  height = 1920,
  scale = 1.0,
  fit = 'cover', // 'cover' | 'contain' | 'fill'
  verticalAlign = 'center', // 'top' | 'center' | 'bottom'
  muted = false,
  volume = 1.0,
}) => {
  const resolvedSrc = resolveMediaSrc(src);

  if (!resolvedSrc) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#111827',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#6b7280',
          fontSize: '28px',
          fontFamily: 'sans-serif',
          border: '2px dashed #374151',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        No Video Selected
      </div>
    );
  }

  // Object position mapping
  let objectPosition = 'center center';
  if (verticalAlign === 'top') objectPosition = 'center top';
  if (verticalAlign === 'bottom') objectPosition = 'center bottom';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        backgroundColor: '#000000',
        zIndex: 10,
      }}
    >
      <Video
        src={resolvedSrc}
        volume={muted ? 0 : volume}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: fit || 'cover',
          objectPosition: objectPosition,
          transform: scale !== 1.0 ? `scale(${scale})` : undefined,
          transformOrigin: 'center center',
          display: 'block',
        }}
      />
    </div>
  );
};
