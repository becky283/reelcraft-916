import React from 'react';
import { Video } from 'remotion';

export function resolveMediaSrc(src) {
  if (!src) return '';
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('blob:') ||
    src.startsWith('data:') ||
    src.startsWith('/')
  ) {
    return src;
  }
  // Convert relative path to root-relative path for Vite proxy and Express
  return `/${src}`;
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
  backdropBlur = false,
  backdropOpacity = 0.7,
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
    <>
      {/* 1. Optional Blurred Video Backdrop to eliminate blank space */}
      {backdropBlur && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '1080px',
            height: '1920px',
            overflow: 'hidden',
            zIndex: 5,
            opacity: backdropOpacity,
            filter: 'blur(40px) brightness(0.55)',
            transform: 'scale(1.2)',
            pointerEvents: 'none',
          }}
        >
          <Video
            src={resolvedSrc}
            volume={0}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* 2. Main Foreground Video Layer */}
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'hidden',
          backgroundColor: backdropBlur ? 'transparent' : '#000000',
          zIndex: 10,
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
            transform: scale !== 1.0 ? `scale(${scale})` : undefined,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </>
  );
};
