import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import { MainComposition } from '../remotion/Composition';
import defaultTemplate from '../../templates/main-template.json';
import { Play, Eye } from 'lucide-react';

export const Preview = ({
  videoSrc,
  videoY = 0,
  videoHeight = 1920,
  videoScale = 1.0,
  fit,
  verticalAlign,
  backdropBlur = false,
  topGradientHeight = 0,
  bottomGradientHeight = 350,
  gradientColor = '#000000',
  gradientOpacity = 1.0,
  caption,
  highlightText,
  font,
  fontSize,
  minFontSize,
  defaultColor,
  highlightColor,
  align,
  captionY = 1120,
  logoY = 980,
  logoWidth = 240,
  logoX,
  logoSrc,
  twibbonSrc,
  logoEnabled,
  twibbonEnabled,
  textStroke,
  textShadow,
  template,
  durationSec = 4,
}) => {
  const fps = 30;
  const durationInFrames = Math.max(1, Math.round(durationSec * fps));

  const inputProps = useMemo(() => ({
    videoSrc,
    videoY,
    videoHeight,
    videoScale,
    fit,
    verticalAlign,
    backdropBlur,
    topGradientHeight,
    bottomGradientHeight,
    gradientColor,
    gradientOpacity,
    caption,
    highlightText,
    font,
    fontSize,
    minFontSize,
    defaultColor,
    highlightColor,
    align,
    captionY,
    logoY,
    logoWidth,
    logoX,
    logoSrc,
    twibbonSrc,
    logoEnabled,
    twibbonEnabled,
    textStroke,
    textShadow,
    template: template || defaultTemplate,
  }), [
    videoSrc,
    videoY,
    videoHeight,
    videoScale,
    fit,
    verticalAlign,
    backdropBlur,
    topGradientHeight,
    bottomGradientHeight,
    gradientColor,
    gradientOpacity,
    caption,
    highlightText,
    font,
    fontSize,
    minFontSize,
    defaultColor,
    highlightColor,
    align,
    captionY,
    logoY,
    logoWidth,
    logoX,
    logoSrc,
    twibbonSrc,
    logoEnabled,
    twibbonEnabled,
    textStroke,
    textShadow,
    template,
  ]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      gap: '12px'
    }}>
      {/* Phone Mockup Frame */}
      <div
        className="phone-mockup"
        style={{
          width: '340px',
          height: '604px', // 9:16 ratio (340 x 604.4)
          maxHeight: 'calc(100vh - 160px)',
          aspectRatio: '9 / 16',
        }}
      >
        <Player
          component={MainComposition}
          inputProps={inputProps}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          loop
          autoPlay={false}
          showVolumeControls
          acknowledgeRemotionLicense
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        <Eye size={13} />
        <span>Live 9:16 Preview (1080 × 1920 canvas)</span>
      </div>
    </div>
  );
};
