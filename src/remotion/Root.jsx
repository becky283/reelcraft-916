import React from 'react';
import { Composition } from 'remotion';
import { MainComposition } from './Composition';
import defaultTemplate from '../../templates/main-template.json';
import '../styles/fonts.css';

export const RemotionRoot = () => {
  const fps = defaultTemplate.canvas?.fps || 30;
  const width = defaultTemplate.canvas?.width || 1080;
  const height = defaultTemplate.canvas?.height || 1920;

  return (
    <>
      <Composition
        id="Main"
        component={MainComposition}
        durationInFrames={120} // default 4s @ 30fps, overridden dynamically by calculateVideoDuration or inputProps
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          videoSrc: '',
          caption: 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!',
          highlightText: 'JIM CRAMER:',
          font: 'Montserrat ExtraBold',
          fontSize: 64,
          minFontSize: 34,
          defaultColor: '#FFFFFF',
          highlightColor: '#FFD600',
          align: 'center',
          fit: 'cover',
          verticalAlign: 'center',
          logoSrc: '/assets/logo.png',
          twibbonSrc: '/assets/twibbon.png',
          logoEnabled: true,
          twibbonEnabled: true,
          template: defaultTemplate,
        }}
      />
    </>
  );
};
