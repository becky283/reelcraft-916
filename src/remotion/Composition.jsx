import React from 'react';
import { AbsoluteFill } from 'remotion';
import { VideoLayer } from './VideoLayer';
import { GradientLayer } from './GradientLayer';
import { BrandingLayer } from './BrandingLayer';
import { CaptionLayer } from './CaptionLayer';
import defaultTemplate from '../../templates/main-template.json';

export const MainComposition = (props) => {
  const template = props.template || defaultTemplate;

  const canvasWidth = template.canvas?.width || 1080;
  const canvasHeight = template.canvas?.height || 1920;

  // Video properties (props override template)
  const videoSlot = template.video || {};
  const videoX = props.videoX !== undefined ? props.videoX : (videoSlot.x ?? 0);
  const videoY = props.videoY !== undefined ? props.videoY : (videoSlot.y ?? 0);
  const videoW = props.videoWidth !== undefined ? props.videoWidth : (videoSlot.width ?? 1080);
  const videoH = props.videoHeight !== undefined ? props.videoHeight : (videoSlot.height ?? 1920);
  const videoScale = props.videoScale !== undefined ? props.videoScale : (videoSlot.scale ?? 1.0);
  const videoFit = props.fit || videoSlot.fit || 'cover';
  const videoAlign = props.verticalAlign || videoSlot.verticalAlign || 'center';
  const backdropBlur = props.backdropBlur ?? (videoSlot.backdropBlur ?? false);

  // Gradient Fade Properties
  const gradientConfig = template.gradient || {};
  const topGradientHeight = props.topGradientHeight !== undefined ? props.topGradientHeight : (gradientConfig.topHeight ?? 0);
  const bottomGradientHeight = props.bottomGradientHeight !== undefined ? props.bottomGradientHeight : (gradientConfig.bottomHeight ?? 650);
  const gradientColor = props.gradientColor || gradientConfig.color || '#000000';
  const gradientOpacity = props.gradientOpacity !== undefined ? props.gradientOpacity : (gradientConfig.opacity ?? 1.0);

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
  const captionX = props.captionX !== undefined ? props.captionX : (captionConfig.x ?? 100);
  const captionY = props.captionY !== undefined ? props.captionY : (captionConfig.y ?? 1400);
  const captionW = props.captionWidth !== undefined ? props.captionWidth : (captionConfig.width ?? 880);
  const captionMaxH = props.captionMaxHeight !== undefined ? props.captionMaxHeight : (captionConfig.maxHeight ?? 500);
  const textShadow = captionConfig.textShadow || '0px 4px 16px rgba(0,0,0,0.95), 0px 2px 6px rgba(0,0,0,0.9)';
  const textStroke = props.textStroke || captionConfig.textStroke || 'none';

  // Logo properties
  const logoConfig = template.logo || {};
  const logoSrc = props.logoSrc !== undefined ? props.logoSrc : logoConfig.path;
  const logoEnabled = props.logoEnabled ?? (logoConfig.enabled !== false);
  const logoX = props.logoX !== undefined ? props.logoX : (logoConfig.x ?? 420);
  const logoY = props.logoY !== undefined ? props.logoY : (logoConfig.y ?? 980);
  const logoW = props.logoWidth !== undefined ? props.logoWidth : (logoConfig.width ?? 240);
  const logoH = props.logoHeight !== undefined ? props.logoHeight : (logoConfig.height ?? 80);

  // Twibbon properties (rendered ON TOP of video and gradients)
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
      {/* 1. Base Layer: Video + Optional Blurred Mirror Backdrop */}
      <VideoLayer
        src={props.videoSrc}
        x={videoX}
        y={videoY}
        width={videoW}
        height={videoH}
        scale={videoScale}
        fit={videoFit}
        verticalAlign={videoAlign}
        muted={props.muted || false}
        volume={props.volume ?? 1.0}
        backdropBlur={backdropBlur}
      />

      {/* 2. Seamless Gradient Edge Feathers (Top & Bottom Fades) */}
      <GradientLayer
        topHeight={topGradientHeight}
        bottomHeight={bottomGradientHeight}
        color={gradientColor}
        opacity={gradientOpacity}
      />

      {/* 3. Top Overlay Layer: Twibbon & Logo Branding (Above Video & Fades) */}
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

      {/* 4. Topmost Layer: Caption Text */}
      <CaptionLayer
        caption={captionText}
        highlightText={highlightText}
        highlightWords={props.highlightWords || []}
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
