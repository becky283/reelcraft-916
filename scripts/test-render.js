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

async function testRender() {
  console.log('=== PHASE 1: TESTING RENDER PIPELINE VIA LOCAL HTTP SERVER ===');
  
  const rootDir = path.join(__dirname, '..');
  const outputsDir = path.join(rootDir, 'outputs');
  const uploadsDir = path.join(rootDir, 'uploads');
  const assetsDir = path.join(rootDir, 'assets');

  [outputsDir, uploadsDir, assetsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Start temporary local Express server for rendering assets
  const app = express();
  app.use(cors());
  app.use('/uploads', express.static(uploadsDir));
  app.use('/assets', express.static(assetsDir));
  app.use('/fonts', express.static(path.join(assetsDir, 'fonts')));

  const PORT = 4123;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`Local asset server running on http://127.0.0.1:${PORT}`);

  try {
    const inputVideoFile = 'sample-landscape.mp4';
    const fullVideoPath = path.join(uploadsDir, inputVideoFile);
    const outputPath = path.join(outputsDir, 'test-phase1-output.mp4');

    console.log('1. Checking input video:', fullVideoPath);
    if (!fs.existsSync(fullVideoPath)) {
      throw new Error('Sample input video does not exist!');
    }

    // Get duration of input video with ffprobe
    const probeOutput = execSync(`"${ffprobe.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${fullVideoPath}"`).toString().trim();
    const durationSec = parseFloat(probeOutput) || 4;
    const fps = 30;
    const durationInFrames = Math.max(1, Math.round(durationSec * fps));
    console.log(`Input video duration: ${durationSec}s (${durationInFrames} frames @ ${fps}fps)`);

    console.log('2. Bundling Remotion composition...');
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
    console.log('Bundle created successfully at:', bundled);

    const inputProps = {
      videoSrc: `http://127.0.0.1:${PORT}/uploads/${inputVideoFile}`,
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
      logoSrc: `http://127.0.0.1:${PORT}/assets/logo.png`,
      twibbonSrc: `http://127.0.0.1:${PORT}/assets/twibbon.png`,
      logoEnabled: true,
      twibbonEnabled: true,
    };

    console.log('3. Selecting composition "Main"...');
    const composition = await selectComposition({
      serveUrl: bundled,
      id: 'Main',
      inputProps,
    });

    // Override duration to match input video
    composition.durationInFrames = durationInFrames;

    console.log('4. Rendering media to MP4 (1080x1920, H.264, AAC)...');
    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      ffmpegExecutable: ffmpeg,
      onProgress: ({ progress }) => {
        process.stdout.write(`\rRendering progress: ${(progress * 100).toFixed(1)}%`);
      },
    });

    console.log('\n5. Render completed successfully!');
    console.log('Output file:', outputPath);

    // Inspect output metadata with ffprobe
    console.log('\n6. Inspecting generated MP4 metadata:');
    const outputProbe = execSync(`"${ffprobe.path}" -v error -show_entries stream=codec_type,codec_name,width,height:format=duration,size -of json "${outputPath}"`).toString();
    console.log(outputProbe);

    const meta = JSON.parse(outputProbe);
    const videoStream = meta.streams.find(s => s.codec_type === 'video');
    const audioStream = meta.streams.find(s => s.codec_type === 'audio');

    console.log('=== VERIFICATION SUMMARY ===');
    console.log(`Resolution: ${videoStream ? `${videoStream.width}x${videoStream.height}` : 'UNKNOWN'}`);
    console.log(`Video Codec: ${videoStream ? videoStream.codec_name : 'NONE'}`);
    console.log(`Audio Codec: ${audioStream ? audioStream.codec_name : 'NONE'}`);
    console.log(`Duration: ${meta.format ? meta.format.duration : 'UNKNOWN'}s`);
    console.log(`File Size: ${meta.format ? (meta.format.size / 1024).toFixed(1) : 'UNKNOWN'} KB`);

    if (videoStream && videoStream.width === 1080 && videoStream.height === 1920 && audioStream) {
      console.log('>>> SUCCESS: ALL PHASE 1 CRITERIA VERIFIED! <<<');
    } else {
      console.warn('>>> WARNING: Output metadata did not match all expected criteria.');
    }
  } finally {
    server.close();
  }
}

testRender().catch(err => {
  console.error('Render test failed:', err);
  process.exit(1);
});
