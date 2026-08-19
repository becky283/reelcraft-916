import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import { MainComposition } from '../remotion/Composition';
import defaultTemplate from '../../templates/main-template.json';
import { Radio, Wifi, Battery } from 'lucide-react';

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
      gap: '12px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Smartphone Device Wrapper with Outer Buttons & Chassis */}
      <div className="phone-device-wrapper">
        {/* Hardware Side Buttons */}
        <div className="phone-btn phone-btn-action" />
        <div className="phone-btn phone-btn-volup" />
        <div className="phone-btn phone-btn-voldown" />
        <div className="phone-btn phone-btn-power" />

        {/* Main Phone Casing */}
        <div className="phone-mockup">
          {/* Top Speaker Ear-piece */}
          <div className="phone-speaker-slit" />

          {/* Dynamic Island Pill */}
          <div className="phone-dynamic-island">
            <div className="phone-camera-lens" />
            <div className="phone-sensor-dot" />
          </div>

          {/* iOS Status Bar Overlay */}
          <div className="phone-status-bar">
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '-0.02em' }}>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wifi size={11} strokeWidth={2.5} />
              <span style={{ fontSize: '9px', fontWeight: 800 }}>5G</span>
              <Battery size={13} strokeWidth={2.5} />
            </div>
          </div>

          {/* Video Player Screen Content */}
          <div className="phone-screen-content">
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

          {/* Bottom Home Indicator Bar */}
          <div className="phone-home-indicator" />
        </div>
      </div>

      {/* Live Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11.5px',
        fontWeight: 700,
        color: '#0a192f',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #cbd5e1',
        padding: '4px 12px',
        borderRadius: '999px',
        boxShadow: '0 2px 10px rgba(10, 25, 47, 0.08)',
      }}>
        <Radio size={12} style={{ color: '#059669' }} />
        <span>Live 9:16 iPhone Studio Canvas (1080 × 1920)</span>
      </div>
    </div>
  );
};
