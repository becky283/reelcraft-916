import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const testCases = [
  {
    name: '1. Landscape 16:9 Video + Cover Fit + Highlighted Phrase',
    videoFile: 'sample-landscape.mp4',
    caption: 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!',
    highlight: 'JIM CRAMER:',
    font: 'Montserrat ExtraBold',
    fit: 'cover',
    verticalAlign: 'center',
  },
  {
    name: '2. Portrait 9:16 Video + Contain Fit + Multi-word Highlight',
    videoFile: 'sample-portrait.mp4',
    caption: 'TUTORIAL CEPAT CARA EDIT VIDEO TIKTOK REELS OTOMATIS',
    highlight: 'TUTORIAL CEPAT',
    font: 'Anton',
    fit: 'contain',
    verticalAlign: 'center',
  },
  {
    name: '3. Square 1:1 Video + Top Align + Very Long Caption (Auto-Shrink Test)',
    videoFile: 'sample-square.mp4',
    caption: 'PERINGATAN PENTING UNTUK SEMUA INVESTOR CRYPTO: PASAR MENGALAMI PENURUNAN TAJAM SETELAH PERNYATAAN TERBARU DARI THE FED DAN REGULATOR GLOBAL HARI INI!',
    highlight: 'PERINGATAN PENTING',
    font: 'Inter Bold',
    fit: 'cover',
    verticalAlign: 'top',
  },
  {
    name: '4. Short Caption + Bebas Neue Font + No Highlight',
    videoFile: 'sample-landscape.mp4',
    caption: 'BREAKING NEWS HARI INI',
    highlight: '',
    font: 'Bebas Neue',
    fit: 'cover',
    verticalAlign: 'center',
  }
];

async function runEdgeCaseTests() {
  console.log('=== PHASE 5: RUNNING COMPREHENSIVE EDGE CASE VERIFICATION ===\n');

  const outputsDir = path.join(rootDir, 'outputs');
  const uploadsDir = path.join(rootDir, 'uploads');
  const assetsDir = path.join(rootDir, 'assets');

  // Start local server for Remotion Chromium renderer
  const app = express();
  app.use(cors());
  app.use('/uploads', express.static(uploadsDir));
  app.use('/assets', express.static(assetsDir));
  app.use('/fonts', express.static(path.join(assetsDir, 'fonts')));

  const PORT = 4250;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  try {
    console.log('Bundling Remotion entry point once for all test cases...');
    const entryPoint = path.join(rootDir, 'src', 'remotion', 'index.jsx');
    const bundled = await bundle({
      entryPoint,
      webpackOverride: (config) => {
        config.module = config.module || { rules: [] };
        config.module.rules.push({
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          type: 'asset/resource',
        });
        return config;
      },
    });
    console.log('Bundle ready.\n');

    let allPassed = true;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      console.log(`--------------------------------------------------`);
      console.log(`Running Test ${i + 1}/${testCases.length}: ${tc.name}`);

      const inputVideoPath = path.join(uploadsDir, tc.videoFile);
      const outputFilename = `test-case-${i + 1}.mp4`;
      const outputPath = path.join(outputsDir, outputFilename);

      // Probe duration
      const probeOutput = execSync(`"${ffprobe.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputVideoPath}"`).toString().trim();
      const durationSec = parseFloat(probeOutput) || 4;
      const fps = 30;
      const durationInFrames = Math.max(1, Math.round(durationSec * fps));

      const inputProps = {
        videoSrc: `http://127.0.0.1:${PORT}/uploads/${tc.videoFile}`,
        caption: tc.caption,
        highlightText: tc.highlight,
        font: tc.font,
        fontSize: 64,
        minFontSize: 34,
        defaultColor: '#FFFFFF',
        highlightColor: '#FFD600',
        align: 'center',
        fit: tc.fit,
        verticalAlign: tc.verticalAlign,
        logoSrc: `http://127.0.0.1:${PORT}/assets/logo.png`,
        twibbonSrc: `http://127.0.0.1:${PORT}/assets/twibbon.png`,
        logoEnabled: true,
        twibbonEnabled: true,
      };

      const composition = await selectComposition({
        serveUrl: bundled,
        id: 'Main',
        inputProps,
      });
      composition.durationInFrames = durationInFrames;

      await renderMedia({
        composition,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps,
        ffmpegExecutable: ffmpeg,
      });

      // Verify with ffprobe
      const outputProbe = execSync(`"${ffprobe.path}" -v error -show_entries stream=codec_type,codec_name,width,height:format=duration,size -of json "${outputPath}"`).toString();
      const meta = JSON.parse(outputProbe);
      const vStream = meta.streams?.find(s => s.codec_type === 'video');
      const aStream = meta.streams?.find(s => s.codec_type === 'audio');

      const isResValid = vStream && vStream.width === 1080 && vStream.height === 1920;
      const isAudioValid = !!aStream && aStream.codec_name === 'aac';
      const isVideoValid = !!vStream && vStream.codec_name === 'h264';

      console.log(`  -> Output: ${outputFilename}`);
      console.log(`  -> Resolution: ${vStream?.width}x${vStream?.height} (Expected: 1080x1920) ${isResValid ? '✓' : '✗'}`);
      console.log(`  -> Video Codec: ${vStream?.codec_name} ${isVideoValid ? '✓' : '✗'}`);
      console.log(`  -> Audio Codec: ${aStream?.codec_name} ${isAudioValid ? '✓' : '✗'}`);
      console.log(`  -> Duration: ${meta.format?.duration}s`);
      console.log(`  -> File Size: ${(meta.format?.size / 1024).toFixed(1)} KB`);

      if (isResValid && isAudioValid && isVideoValid) {
        console.log(`  -> Result: PASSED ✓\n`);
      } else {
        console.log(`  -> Result: FAILED ✗\n`);
        allPassed = false;
      }
    }

    console.log('==================================================');
    if (allPassed) {
      console.log('🎉 ALL EDGE CASES PASSED! Every test produced 1080x1920 MP4 with AAC audio.');
    } else {
      console.log('❌ Some edge cases failed verification.');
    }
  } finally {
    server.close();
  }
}

runEdgeCaseTests().catch(err => {
  console.error('Edge case test execution failed:', err);
  process.exit(1);
});
