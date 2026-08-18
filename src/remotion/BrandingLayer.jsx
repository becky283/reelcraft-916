import React from 'react';
import { Img } from 'remotion';
import { resolveMediaSrc } from './VideoLayer';

export const BrandingLayer = ({
  twibbonSrc,
  twibbonEnabled = true,
  logoSrc,
  logoEnabled = true,
  logoX = 420,
  logoY = 980,
  logoWidth = 240,
  logoHeight = 80,
}) => {
  const resolvedLogo = logoSrc ? resolveMediaSrc(logoSrc) : '';
  const resolvedTwibbon = twibbonSrc ? resolveMediaSrc(twibbonSrc) : '';

  return (
    <>
      {/* Logo Overlay */}
      {logoEnabled && resolvedLogo && (
        <div
          style={{
            position: 'absolute',
            left: `${logoX}px`,
            top: `${logoY}px`,
            width: `${logoWidth}px`,
            height: `${logoHeight}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <Img
            src={resolvedLogo}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Twibbon / Full Frame Overlay */}
      {twibbonEnabled && resolvedTwibbon && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '1080px',
            height: '1920px',
            zIndex: 45,
            pointerEvents: 'none',
          }}
        >
          <Img
            src={resolvedTwibbon}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </>
  );
};
