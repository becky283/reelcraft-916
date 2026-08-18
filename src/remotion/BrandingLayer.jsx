import React from 'react';
import { Img } from 'remotion';
import { resolveMediaSrc } from './VideoLayer';

export const BrandingLayer = ({
  twibbonSrc,
  twibbonEnabled = true,
  logoSrc,
  logoEnabled = true,
  logoX,
  logoY = 980,
  logoWidth = 240,
  logoHeight,
  logoCenter = true,
}) => {
  const resolvedLogo = logoSrc ? resolveMediaSrc(logoSrc) : '';
  const resolvedTwibbon = twibbonSrc ? resolveMediaSrc(twibbonSrc) : '';

  // Calculate horizontal position
  const computedX = logoX !== undefined ? logoX : Math.round((1080 - logoWidth) / 2);
  const computedHeight = logoHeight || Math.round(logoWidth * 0.55);

  return (
    <>
      {/* Logo Overlay */}
      {logoEnabled && resolvedLogo && (
        <div
          style={{
            position: 'absolute',
            left: `${computedX}px`,
            top: `${logoY}px`,
            width: `${logoWidth}px`,
            height: `${computedHeight}px`,
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
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
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
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      )}
    </>
  );
};
