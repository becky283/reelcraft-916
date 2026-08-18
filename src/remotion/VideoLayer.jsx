import React from 'react';
import { Video, staticFile } from 'remotion';

export function resolveMediaSrc(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:') || src.startsWith('data:')) {
    return src;
  }
  // Strip leading slash if any for staticFile
  const cleanPath = src.replace(/^\/+/, '');
  return staticFile(cleanPath);
}

export const VideoLayer = ({
  src,
  x = 0,
  y = 200,
  width = 1080,
  height = 700,
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
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#888',
          fontSize: '28px',
          fontFamily: 'sans-serif',
          border: '2px dashed #444',
          boxSizing: 'border-box',
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
      }}
    >
      <Video
        src={resolvedSrc}
        volume={muted ? 0 : volume}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: objectPosition,
        }}
      />
    </div>
  );
};
