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

// Helper to parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [k, v] = arg.slice(2).split('=');
      params[k] = v === undefined ? true : v;
    }
  });
  return params;
}

async function main() {
  const params = parseArgs();
  console.log('=== AUTO EDITOR CLI RENDERER ===');

  const outputsDir = path.join(rootDir, 'outputs');
  const uploadsDir = path.join(rootDir, 'uploads');
  const assetsDir = path.join(rootDir, 'assets');
  const templatesDir = path.join(rootDir, 'templates');

  [outputsDir, uploadsDir, assetsDir, templatesDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Load template
  const templatePath = path.join(templatesDir, 'main-template.json');
  let template = {};
  if (fs.existsSync(templatePath)) {
    template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  }

  // Determine input video
  let inputFile = params.input || 'sample-landscape.mp4';
  let fullInputPath = path.isAbsolute(inputFile) ? inputFile : path.join(uploadsDir, path.basename(inputFile));

  if (!fs.existsSync(fullInputPath)) {
    // If not found in uploads, try relative to root
    fullInputPath = path.join(rootDir, inputFile);
    if (!fs.existsSync(fullInputPath)) {
      console.error(`Error: Input video "${inputFile}" not found.`);
      console.log('Available files in uploads:');
      console.log(fs.readdirSync(uploadsDir));
      process.exit(1);
    }
  }

  const caption = params.caption || 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!';
  const highlightText = params.highlight || 'JIM CRAMER:';
  const font = params.font || 'Montserrat ExtraBold';
  const defaultColor = params.defaultColor || '#FFFFFF';
  const highlightColor = params.highlightColor || '#FFD600';
  const fit = params.fit || 'cover';
  const verticalAlign = params.verticalAlign || 'center';

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFilename = params.output ? path.basename(params.output) : `video-${dateStr}.mp4`;
  const outputPath = path.isAbsolute(params.output || '') ? params.output : path.join(outputsDir, outputFilename);

  console.log('Input:', fullInputPath);
  console.log('Output:', outputPath);
  console.log('Caption:', caption);
  console.log('Highlight:', highlightText);

  // Probe input video
  const probeOutput = execSync(`"${ffprobe.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${fullInputPath}"`).toString().trim();
  const durationSec = parseFloat(probeOutput) || 4;
  const fps = 30;
  const durationInFrames = Math.max(1, Math.round(durationSec * fps));
  console.log(`Duration: ${durationSec}s (${durationInFrames} frames @ ${fps}fps)`);

  // Start internal static server for rendering Chromium
  const app = express();
  app.use(cors());
  app.use('/uploads', express.static(uploadsDir));
  app.use('/assets', express.static(assetsDir));
  app.use('/fonts', express.static(path.join(assetsDir, 'fonts')));

  const PORT = 4199;
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  try {
    console.log('Bundling composition...');
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

    const inputProps = {
      videoSrc: `http://127.0.0.1:${PORT}/uploads/${path.basename(fullInputPath)}`,
      caption,
      highlightText,
      font,
      fontSize: 64,
      minFontSize: 34,
      defaultColor,
      highlightColor,
      align: 'center',
      captionY: 1400,
      bottomGradientHeight: 650,
      fit,
      verticalAlign,
      logoSrc: `http://127.0.0.1:${PORT}/assets/logo.png`,
      twibbonSrc: `http://127.0.0.1:${PORT}/assets/twibbon.png`,
      logoEnabled: true,
      twibbonEnabled: true,
      template,
    };

    console.log('Rendering 1080x1920 MP4...');
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
      onProgress: ({ progress }) => {
        process.stdout.write(`\rProgress: ${(progress * 100).toFixed(1)}%`);
      },
    });

    console.log('\nRender completed successfully!');
    console.log('Saved to:', outputPath);
  } finally {
    server.close();
  }
}

main().catch(err => {
  console.error('CLI Render failed:', err);
  process.exit(1);
});
