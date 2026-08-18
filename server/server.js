import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec, execSync } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const uploadsDir = path.join(rootDir, 'uploads');
const assetsDir = path.join(rootDir, 'assets');
const fontsDir = path.join(assetsDir, 'fonts');
const outputsDir = path.join(rootDir, 'outputs');
const templatesDir = path.join(rootDir, 'templates');
const templateFile = path.join(templatesDir, 'main-template.json');
const settingsFile = path.join(rootDir, 'settings.json');

// Ensure directories exist
[uploadsDir, assetsDir, fontsDir, outputsDir, templatesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static directories
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(assetsDir));
app.use('/fonts', express.static(fontsDir));
app.use('/outputs', express.static(outputsDir));
app.use('/templates', express.static(templatesDir));

// Multer storage configuration for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    cb(null, `${cleanBase}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit for local uploads
});

// In-memory render jobs store
const renderJobs = new Map();
let cachedBundlePath = null;

// Probe video metadata using ffprobe
function probeVideo(filePath) {
  try {
    const cmd = `"${ffprobe.path}" -v error -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,duration:format=duration,size -of json "${filePath}"`;
    const output = execSync(cmd).toString();
    const data = JSON.parse(output);

    const videoStream = data.streams?.find((s) => s.codec_type === 'video') || {};
    const audioStream = data.streams?.find((s) => s.codec_type === 'audio') || null;

    let duration = parseFloat(data.format?.duration || videoStream.duration || 0);
    if (!duration || isNaN(duration)) duration = 5;

    let fps = 30;
    if (videoStream.r_frame_rate) {
      const [num, den] = videoStream.r_frame_rate.split('/').map(Number);
      if (den && num) fps = Math.round(num / den);
    }

    return {
      duration,
      width: videoStream.width || 1920,
      height: videoStream.height || 1080,
      fps: fps || 30,
      hasAudio: !!audioStream,
      videoCodec: videoStream.codec_name || 'unknown',
      audioCodec: audioStream ? audioStream.codec_name : null,
      size: data.format?.size || 0,
    };
  } catch (err) {
    console.warn('ffprobe warning:', err.message);
    return {
      duration: 5,
      width: 1920,
      height: 1080,
      fps: 30,
      hasAudio: true,
      videoCodec: 'h264',
      audioCodec: 'aac',
      size: 0,
    };
  }
}

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ffmpeg: !!ffmpeg,
    ffprobe: !!ffprobe.path,
    uptime: process.uptime(),
  });
});

// 2. Video Upload API
app.post('/api/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const filePath = req.file.path;
    const filename = req.file.filename;
    const metadata = probeVideo(filePath);

    res.json({
      success: true,
      filename,
      filePath,
      url: `/uploads/${filename}`,
      originalName: req.file.originalname,
      ...metadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Asset Upload API (Logo or Twibbon)
app.post('/api/upload-asset', upload.single('asset'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No asset file provided' });
    }
    const type = req.body.type || 'custom'; // 'logo' | 'twibbon' | 'custom'
    const ext = path.extname(req.file.originalname).toLowerCase() || '.png';
    const destName = `${type}-${Date.now()}${ext}`;
    const destPath = path.join(assetsDir, destName);
    
    fs.renameSync(req.file.path, destPath);

    res.json({
      success: true,
      filename: destName,
      url: `/assets/${destName}`,
      type,
    });
  } catch (error) {
    console.error('Asset upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Sample Videos List
app.get('/api/samples', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const videoFiles = files.filter((f) => /\.(mp4|mov|m4v|webm|mkv)$/i.test(f));
    const samples = videoFiles.map((file) => {
      const fullPath = path.join(uploadsDir, file);
      const meta = probeVideo(fullPath);
      return {
        filename: file,
        url: `/uploads/${file}`,
        ...meta,
      };
    });
    res.json({ samples });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Template Configs API (Multi-Template support)
app.get('/api/templates', (req, res) => {
  try {
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
    const templates = files.map(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
        return {
          id: file.replace('.json', ''),
          filename: file,
          name: content.name || file.replace('.json', ''),
          ...content,
        };
      } catch(e) {
        return null;
      }
    }).filter(Boolean);
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/template', (req, res) => {
  try {
    const targetFile = req.query.id ? path.join(templatesDir, `${req.query.id}.json`) : templateFile;
    if (fs.existsSync(targetFile)) {
      const data = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
      res.json(data);
    } else {
      res.status(404).json({ error: 'Template file not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/templates', (req, res) => {
  try {
    const templateData = req.body;
    const cleanId = (templateData.id || templateData.name || 'custom-template')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    
    const targetPath = path.join(templatesDir, `${cleanId}.json`);
    const finalData = {
      id: cleanId,
      name: templateData.name || 'Untitled Template',
      ...templateData,
    };
    fs.writeFileSync(targetPath, JSON.stringify(finalData, null, 2), 'utf-8');
    res.json({ success: true, template: finalData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/templates/:id', (req, res) => {
  try {
    const templateId = req.params.id;
    if (templateId === 'main-template') {
      return res.status(400).json({ error: 'Cannot delete default main template' });
    }
    const targetPath = path.join(templatesDir, `${templateId}.json`);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Fonts API
app.get('/api/fonts', (req, res) => {
  try {
    const fontFiles = fs.existsSync(fontsDir) ? fs.readdirSync(fontsDir) : [];
    const fonts = [
      { id: 'Montserrat ExtraBold', name: 'Montserrat ExtraBold (Default)', file: 'Montserrat-ExtraBold.ttf' },
      { id: 'Anton', name: 'Anton (Impactful)', file: 'Anton-Regular.ttf' },
      { id: 'Bebas Neue', name: 'Bebas Neue (Clean Tall)', file: 'BebasNeue-Regular.ttf' },
      { id: 'Inter Bold', name: 'Inter Bold (Modern Sans)', file: 'Inter-Bold.ttf' },
      { id: 'Impact', name: 'Impact (System)' },
      { id: 'Arial Black', name: 'Arial Black (System)' },
    ];
    res.json({ fonts, files: fontFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Settings API
app.get('/api/settings', (req, res) => {
  try {
    if (fs.existsSync(settingsFile)) {
      res.json(JSON.parse(fs.readFileSync(settingsFile, 'utf-8')));
    } else {
      res.json({});
    }
  } catch (error) {
    res.json({});
  }
});

app.post('/api/settings', (req, res) => {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Outputs API (List rendered exports)
app.get('/api/outputs', (req, res) => {
  try {
    const files = fs.readdirSync(outputsDir);
    const mp4Files = files
      .filter((f) => f.endsWith('.mp4'))
      .map((f) => {
        const fullPath = path.join(outputsDir, f);
        const stat = fs.statSync(fullPath);
        return {
          filename: f,
          path: fullPath,
          url: `/outputs/${f}`,
          size: stat.size,
          createdAt: stat.birthtime,
          modifiedAt: stat.mtime,
        };
      })
      .sort((a, b) => b.modifiedAt - a.modifiedAt);
    res.json({ outputs: mp4Files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Open Output Folder in OS
app.post('/api/open-folder', (req, res) => {
  try {
    const targetPath = req.body.folderPath || outputsDir;
    if (process.platform === 'win32') {
      exec(`explorer.exe "${targetPath}"`);
    } else {
      open(targetPath);
    }
    res.json({ success: true, path: targetPath });
  } catch (error) {
    console.error('Error opening folder:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Open Rendered Video File in OS Player
app.post('/api/open-video', (req, res) => {
  try {
    const filename = req.body.filename;
    const fullPath = filename ? path.join(outputsDir, filename) : req.body.filePath;
    if (!fullPath || !fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    if (process.platform === 'win32') {
      exec(`start "" "${fullPath}"`);
    } else {
      open(fullPath);
    }
    res.json({ success: true, path: fullPath });
  } catch (error) {
    console.error('Error opening video:', error);
    res.status(500).json({ error: error.message });
  }
});

// 11. Render Job Status API (Polling or Event stream)
app.get('/api/render-status/:jobId', (req, res) => {
  const job = renderJobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// 12. Render Media API (Trigger rendering)
app.post('/api/render', async (req, res) => {
  const jobId = `job-${Date.now()}`;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const outputFilename = `video-${dateStr}.mp4`;
  const outputPath = path.join(outputsDir, outputFilename);

  const renderState = {
    id: jobId,
    status: 'preparing', // preparing -> bundling -> rendering -> completed / error
    progress: 0,
    message: 'Preparing rendering environment...',
    outputPath,
    outputFilename,
    url: `/outputs/${outputFilename}`,
    error: null,
    startedAt: Date.now(),
    completedAt: null,
  };

  renderJobs.set(jobId, renderState);

  // Return initial job ID so UI can monitor progress
  res.json({ success: true, jobId, ...renderState });

  // Execute rendering in background
  (async () => {
    try {
      const {
        videoSrc,
        videoY = 0,
        videoHeight = 1920,
        videoScale = 1.0,
        fit = 'cover',
        verticalAlign = 'center',
        backdropBlur = false,
        topGradientHeight = 0,
        bottomGradientHeight = 350,
        gradientColor = '#000000',
        gradientOpacity = 1.0,
        caption = 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!',
        highlightWords = [],
        highlightText = '',
        font = 'Montserrat ExtraBold',
        fontSize = 64,
        minFontSize = 34,
        defaultColor = '#FFFFFF',
        highlightColor = '#FFD600',
        align = 'center',
        captionY = 1120,
        logoY = 980,
        logoWidth = 240,
        logoX,
        logoSrc = '/assets/logo.png',
        twibbonSrc = '/assets/twibbon.png',
        logoEnabled = true,
        twibbonEnabled = true,
        textStroke = 'none',
        textShadow = '0px 4px 16px rgba(0,0,0,0.95), 0px 2px 6px rgba(0,0,0,0.9)',
        template = null,
      } = req.body;

      if (!videoSrc) {
        throw new Error('No video source provided for rendering');
      }

      // Convert local relative paths to HTTP URLs for Remotion Chromium browser
      const toHttpUrl = (src) => {
        if (!src) return '';
        if (src.startsWith('http://') || src.startsWith('https://')) return src;
        const clean = src.startsWith('/') ? src : `/${src}`;
        return `http://127.0.0.1:${PORT}${clean}`;
      };

      const resolvedVideoUrl = toHttpUrl(videoSrc);
      const resolvedLogoUrl = toHttpUrl(logoSrc);
      const resolvedTwibbonUrl = toHttpUrl(twibbonSrc);

      // Determine duration from video file
      let durationInFrames = 120;
      let durationSec = 4;
      const fps = 30;

      // Extract local file path if video is in uploads
      const match = videoSrc.match(/\/uploads\/(.+)$/);
      if (match) {
        const localUploadFile = path.join(uploadsDir, match[1]);
        if (fs.existsSync(localUploadFile)) {
          const meta = probeVideo(localUploadFile);
          durationSec = meta.duration;
          durationInFrames = Math.max(1, Math.round(durationSec * fps));
        }
      }

      renderState.status = 'bundling';
      renderState.message = 'Bundling video layout composition...';
      renderState.progress = 0.05;

      const entryPoint = path.join(rootDir, 'src', 'remotion', 'index.jsx');

      // Create bundle
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
        videoSrc: resolvedVideoUrl,
        videoY: Number(videoY) || 0,
        videoHeight: Number(videoHeight) || 1920,
        videoScale: Number(videoScale) || 1.0,
        fit,
        verticalAlign,
        backdropBlur: !!backdropBlur,
        topGradientHeight: Number(topGradientHeight) || 0,
        bottomGradientHeight: Number(bottomGradientHeight) || 0,
        gradientColor,
        gradientOpacity: Number(gradientOpacity) ?? 1.0,
        caption,
        highlightWords: Array.isArray(highlightWords) ? highlightWords : [],
        highlightText,
        font,
        fontSize: Number(fontSize) || 64,
        minFontSize: Number(minFontSize) || 34,
        defaultColor,
        highlightColor,
        align,
        captionY: Number(captionY) || 1120,
        logoY: Number(logoY) || 980,
        logoWidth: Number(logoWidth) || 240,
        logoX: logoX !== undefined ? Number(logoX) : undefined,
        logoSrc: resolvedLogoUrl,
        twibbonSrc: resolvedTwibbonUrl,
        logoEnabled,
        twibbonEnabled,
        textStroke,
        textShadow,
        template: template || undefined,
      };

      renderState.status = 'rendering';
      renderState.message = 'Rendering video frames (1080x1920)...';
      renderState.progress = 0.1;

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
          renderState.progress = Math.min(0.99, 0.1 + progress * 0.89);
          renderState.message = `Rendering frames: ${(progress * 100).toFixed(0)}%`;
        },
      });

      renderState.progress = 1.0;
      renderState.status = 'completed';
      renderState.message = 'Video generated successfully!';
      renderState.completedAt = Date.now();
      console.log(`[Job ${jobId}] Rendered successfully -> ${outputPath}`);
    } catch (err) {
      console.error(`[Job ${jobId}] Error:`, err);
      renderState.status = 'error';
      renderState.message = `Render failed: ${err.message}`;
      renderState.error = err.message;
    }
  })();
});

// Start Server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Auto Editor Backend API running on http://127.0.0.1:${PORT}`);
});
