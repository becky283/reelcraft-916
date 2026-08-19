import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import { MainComposition } from '../remotion/Composition';
import defaultTemplate from '../../templates/main-template.json';
import { Eye, Radio } from 'lucide-react';

export const Preview = ({
  videoSrc,
  muted = false,
  volume = 1.0,
  videoY = 0,
  videoHeight = 1920,
  videoScale = 1.0,
  fit,
  verticalAlign,
  backdropBlur = false,
  topGradientHeight = 0,
  bottomGradientHeight = 650,
  gradientColor = '#000000',
  gradientOpacity = 1.0,
  caption,
  highlightText,
  highlightWords = [],
  font,
  fontSize,
  minFontSize,
  defaultColor,
  highlightColor,
  align,
  captionY = 1400,
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
    muted,
    volume,
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
    highlightWords,
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
    muted,
    volume,
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
    highlightWords,
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
      gap: '14px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Phone Mockup Frame */}
      <div
        className="phone-mockup"
        style={{
          width: '340px',
          height: '604px', // 9:16 ratio
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

      {/* Live Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11.5px',
        color: 'var(--text-muted)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        padding: '4px 10px',
        borderRadius: '999px',
        boxShadow: 'var(--glass-specular-subtle)',
      }}>
        <Radio size={12} style={{ color: '#10b981' }} />
        <span>Live 9:16 Studio Canvas (1080 × 1920)</span>
      </div>
    </div>
  );
};
