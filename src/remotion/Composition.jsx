import React from 'react';
import { AbsoluteFill } from 'remotion';
import { VideoLayer } from './VideoLayer';
import { BrandingLayer } from './BrandingLayer';
import { CaptionLayer } from './CaptionLayer';
import defaultTemplate from '../../templates/main-template.json';

export const MainComposition = (props) => {
  const template = props.template || defaultTemplate;

  const canvasWidth = template.canvas?.width || 1080;
  const canvasHeight = template.canvas?.height || 1920;

  // Video properties (props override template)
  const videoSlot = template.video || {};
  const videoX = videoSlot.x ?? 0;
  const videoY = videoSlot.y ?? 200;
  const videoW = videoSlot.width ?? 1080;
  const videoH = videoSlot.height ?? 700;
  const videoFit = props.fit || videoSlot.fit || 'cover';
  const videoAlign = props.verticalAlign || videoSlot.verticalAlign || 'center';

  // Caption properties (props override template)
  const captionConfig = template.caption || {};
  const captionText = props.caption ?? 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!';
  const highlightText = props.highlightText ?? 'JIM CRAMER:';
  const font = props.font || captionConfig.font || 'Montserrat ExtraBold';
  const fontSize = props.fontSize || captionConfig.fontSize || 64;
  const minFontSize = props.minFontSize || captionConfig.minFontSize || 34;
  const defaultColor = props.defaultColor || captionConfig.defaultColor || '#FFFFFF';
  const highlightColor = props.highlightColor || captionConfig.highlightColor || '#FFD600';
  const captionAlign = props.align || captionConfig.align || 'center';
  const captionX = captionConfig.x ?? 100;
  const captionY = captionConfig.y ?? 1120;
  const captionW = captionConfig.width ?? 880;
  const captionMaxH = captionConfig.maxHeight ?? 500;
  const textShadow = captionConfig.textShadow || '0px 4px 16px rgba(0,0,0,0.95), 0px 2px 6px rgba(0,0,0,0.9)';
  const textStroke = props.textStroke || captionConfig.textStroke || 'none';

  // Logo properties
  const logoConfig = template.logo || {};
  const logoSrc = props.logoSrc !== undefined ? props.logoSrc : logoConfig.path;
  const logoEnabled = props.logoEnabled ?? (logoConfig.enabled !== false);
  const logoX = logoConfig.x ?? 420;
  const logoY = logoConfig.y ?? 980;
  const logoW = logoConfig.width ?? 240;
  const logoH = logoConfig.height ?? 80;

  // Twibbon properties
  const twibbonConfig = template.twibbon || {};
  const twibbonSrc = props.twibbonSrc !== undefined ? props.twibbonSrc : (typeof twibbonConfig === 'string' ? twibbonConfig : twibbonConfig.path);
  const twibbonEnabled = props.twibbonEnabled ?? (twibbonConfig.enabled !== false);

  const backgroundColor = props.backgroundColor || template.backgroundColor || '#000000';

  return (
    <AbsoluteFill
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        backgroundColor: backgroundColor,
        overflow: 'hidden',
      }}
    >
      {/* 1. Video Layer */}
      <VideoLayer
        src={props.videoSrc}
        x={videoX}
        y={videoY}
        width={videoW}
        height={videoH}
        fit={videoFit}
        verticalAlign={videoAlign}
        muted={props.muted || false}
        volume={props.volume ?? 1.0}
      />

      {/* 2. Twibbon & Logo Branding Layer */}
      <BrandingLayer
        twibbonSrc={twibbonSrc}
        twibbonEnabled={twibbonEnabled}
        logoSrc={logoSrc}
        logoEnabled={logoEnabled}
        logoX={logoX}
        logoY={logoY}
        logoWidth={logoW}
        logoHeight={logoH}
      />

      {/* 3. Caption Layer */}
      <CaptionLayer
        caption={captionText}
        highlightText={highlightText}
        font={font}
        fontSize={fontSize}
        minFontSize={minFontSize}
        defaultColor={defaultColor}
        highlightColor={highlightColor}
        align={captionAlign}
        textShadow={textShadow}
        textStroke={textStroke}
        x={captionX}
        y={captionY}
        width={captionW}
        maxHeight={captionMaxH}
      />
    </AbsoluteFill>
  );
};
