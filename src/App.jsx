import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { CaptionEditor } from './components/CaptionEditor';
import { StyleControls } from './components/StyleControls';
import { VideoFitControls } from './components/VideoFitControls';
import { BrandingControls } from './components/BrandingControls';
import { Preview } from './components/Preview';
import { GenerateModal } from './components/GenerateModal';
import { Play, Sparkles, FolderOpen, Film } from 'lucide-react';
import defaultTemplate from '../templates/main-template.json';

const STORAGE_KEY = 'auto_editor_user_settings_v1';

export function App() {
  // Load saved settings from localStorage if available
  const saved = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  })();

  // Core State
  const [videoSrc, setVideoSrc] = useState(saved.videoSrc || '/uploads/sample-landscape.mp4');
  const [videoMeta, setVideoMeta] = useState(saved.videoMeta || {
    filename: 'sample-landscape.mp4',
    duration: 4,
    width: 1920,
    height: 1080,
    hasAudio: true,
  });
  const [samples, setSamples] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Caption State
  const [caption, setCaption] = useState(saved.caption ?? 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!');
  const [highlightText, setHighlightText] = useState(saved.highlightText ?? 'JIM CRAMER:');
  const [defaultColor, setDefaultColor] = useState(saved.defaultColor || '#FFFFFF');
  const [highlightColor, setHighlightColor] = useState(saved.highlightColor || '#FFD600');
  const [uppercase, setUppercase] = useState(saved.uppercase ?? true);
  const [textStroke, setTextStroke] = useState(saved.textStroke || 'none');

  // Style State
  const [font, setFont] = useState(saved.font || 'Montserrat ExtraBold');
  const [fontSize, setFontSize] = useState(saved.fontSize || 64);
  const [align, setAlign] = useState(saved.align || 'center');

  // Video Fit State
  const [fit, setFit] = useState(saved.fit || 'cover');
  const [verticalAlign, setVerticalAlign] = useState(saved.verticalAlign || 'center');

  // Branding State
  const [twibbonEnabled, setTwibbonEnabled] = useState(saved.twibbonEnabled ?? true);
  const [twibbonSrc, setTwibbonSrc] = useState(saved.twibbonSrc || '/assets/twibbon.png');
  const [logoEnabled, setLogoEnabled] = useState(saved.logoEnabled ?? true);
  const [logoSrc, setLogoSrc] = useState(saved.logoSrc || '/assets/logo.png');

  // Outputs / Template State
  const [template, setTemplate] = useState(defaultTemplate);
  const [outputsList, setOutputsList] = useState([]);

  // Render Modal State
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [renderJobId, setRenderJobId] = useState(null);
  const [renderStatus, setRenderStatus] = useState('idle');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMessage, setRenderMessage] = useState('');
  const [outputFilename, setOutputFilename] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [renderError, setRenderError] = useState(null);

  // Save persistent settings to localStorage
  useEffect(() => {
    try {
      const currentSettings = {
        font,
        fontSize,
        align,
        defaultColor,
        highlightColor,
        uppercase,
        textStroke,
        fit,
        verticalAlign,
        twibbonEnabled,
        logoEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (e) {}
  }, [font, fontSize, align, defaultColor, highlightColor, uppercase, textStroke, fit, verticalAlign, twibbonEnabled, logoEnabled]);

  // Fetch initial backend data (samples, outputs, template)
  const refreshData = useCallback(async () => {
    try {
      // Samples
      const sampleRes = await fetch('/api/samples');
      if (sampleRes.ok) {
        const data = await sampleRes.json();
        if (data.samples && data.samples.length > 0) {
          setSamples(data.samples);
          // If no video is selected yet, select first sample
          if (!videoSrc) {
            setVideoSrc(data.samples[0].url);
            setVideoMeta(data.samples[0]);
          }
        }
      }

      // Outputs count
      const outRes = await fetch('/api/outputs');
      if (outRes.ok) {
        const data = await outRes.json();
        setOutputsList(data.outputs || []);
      }

      // Template
      const tmplRes = await fetch('/api/template');
      if (tmplRes.ok) {
        const data = await tmplRes.json();
        setTemplate(data);
      }
    } catch (e) {
      console.warn('Backend offline or not yet ready:', e.message);
    }
  }, [videoSrc]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Video File Upload
  const handleSelectVideo = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
      const data = await res.json();

      setVideoSrc(data.url);
      setVideoMeta({
        filename: data.filename,
        originalName: data.originalName,
        duration: data.duration,
        width: data.width,
        height: data.height,
        fps: data.fps,
        hasAudio: data.hasAudio,
      });
      refreshData();
    } catch (err) {
      console.error('Error uploading video:', err);
      // Fallback to local object URL for preview if server upload fails
      const localUrl = URL.createObjectURL(file);
      setVideoSrc(localUrl);
      setVideoMeta({
        filename: file.name,
        originalName: file.name,
        duration: 5,
        width: 1920,
        height: 1080,
        hasAudio: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Sample Selection
  const handleSelectSample = (sample) => {
    setVideoSrc(sample.url);
    setVideoMeta(sample);
  };

  // Handle Asset Upload (Logo / Twibbon)
  const handleUploadAsset = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('asset', file);
      formData.append('type', type);

      const res = await fetch('/api/upload-asset', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload asset');
      const data = await res.json();

      if (type === 'logo') {
        setLogoSrc(data.url);
        setLogoEnabled(true);
      } else if (type === 'twibbon') {
        setTwibbonSrc(data.url);
        setTwibbonEnabled(true);
      }
    } catch (err) {
      console.error('Asset upload error:', err);
    }
  };

  // Trigger Video Render
  const handleGenerateVideo = async () => {
    if (!videoSrc) {
      alert('Please choose a video first.');
      return;
    }

    setIsRenderModalOpen(true);
    setRenderStatus('preparing');
    setRenderProgress(0.05);
    setRenderMessage('Starting render process...');
    setRenderError(null);

    try {
      const payload = {
        videoSrc,
        caption,
        highlightText,
        font,
        fontSize,
        minFontSize: 34,
        defaultColor,
        highlightColor,
        align,
        fit,
        verticalAlign,
        logoSrc,
        twibbonSrc,
        logoEnabled,
        twibbonEnabled,
        textStroke,
        template,
      };

      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setRenderJobId(data.jobId);
      setOutputFilename(data.outputFilename);
      setOutputPath(data.outputPath);

      // Start polling status
      pollRenderStatus(data.jobId);
    } catch (err) {
      console.error('Render trigger error:', err);
      setRenderStatus('error');
      setRenderError(err.message);
    }
  };

  // Poll Render Job Progress
  const pollRenderStatus = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/render-status/${jobId}`);
        if (!res.ok) return;

        const job = await res.json();
        setRenderStatus(job.status);
        setRenderProgress(job.progress || 0);
        setRenderMessage(job.message || '');

        if (job.status === 'completed') {
          clearInterval(interval);
          setOutputFilename(job.outputFilename);
          setOutputPath(job.outputPath);
          refreshData();
        } else if (job.status === 'error') {
          clearInterval(interval);
          setRenderError(job.error || 'Rendering encountered an error');
        }
      } catch (e) {
        console.warn('Polling error:', e.message);
      }
    }, 600);
  };

  // Open Outputs Folder in Windows Explorer
  const handleOpenFolder = async () => {
    try {
      await fetch('/api/open-folder', { method: 'POST' });
    } catch (e) {
      console.error('Failed to open folder:', e);
    }
  };

  // Open Video File in Media Player
  const handleOpenVideo = async (filename) => {
    try {
      await fetch('/api/open-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
    } catch (e) {
      console.error('Failed to open video:', e);
    }
  };

  // Reset to default presets
  const handleResetSettings = () => {
    if (window.confirm('Reset caption style and framing to default template presets?')) {
      localStorage.removeItem(STORAGE_KEY);
      setFont('Montserrat ExtraBold');
      setFontSize(64);
      setAlign('center');
      setDefaultColor('#FFFFFF');
      setHighlightColor('#FFD600');
      setUppercase(true);
      setTextStroke('none');
      setFit('cover');
      setVerticalAlign('center');
      setTwibbonEnabled(true);
      setLogoEnabled(true);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        onOpenOutputFolder={handleOpenFolder}
        onResetSettings={handleResetSettings}
        outputsCount={outputsList.length}
      />

      {/* Main Studio Content */}
      <div className="main-content">
        {/* Left Controls Column */}
        <aside className="controls-sidebar">
          {/* 1. Video Picker */}
          <VideoUploader
            videoSrc={videoSrc}
            videoMeta={videoMeta}
            samples={samples}
            onSelectVideo={handleSelectVideo}
            onSelectSample={handleSelectSample}
            isUploading={isUploading}
          />

          {/* 2. Caption Editor */}
          <CaptionEditor
            caption={caption}
            onChangeCaption={setCaption}
            highlightText={highlightText}
            onChangeHighlight={setHighlightText}
            defaultColor={defaultColor}
            onChangeDefaultColor={setDefaultColor}
            highlightColor={highlightColor}
            onChangeHighlightColor={setHighlightColor}
            uppercase={uppercase}
            onToggleUppercase={setUppercase}
            textStroke={textStroke}
            onChangeTextStroke={setTextStroke}
          />

          {/* 3. Typography & Styling */}
          <StyleControls
            font={font}
            onChangeFont={setFont}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            align={align}
            onChangeAlign={setAlign}
          />

          {/* 4. Video Fit & Alignment */}
          <VideoFitControls
            fit={fit}
            onChangeFit={setFit}
            verticalAlign={verticalAlign}
            onChangeVerticalAlign={setVerticalAlign}
          />

          {/* 5. Twibbon & Logo Overlays */}
          <BrandingControls
            twibbonEnabled={twibbonEnabled}
            onToggleTwibbon={setTwibbonEnabled}
            twibbonSrc={twibbonSrc}
            logoEnabled={logoEnabled}
            onToggleLogo={setLogoEnabled}
            logoSrc={logoSrc}
            onUploadAsset={handleUploadAsset}
          />

          {/* 6. Big Generate Action Button */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '16px 24px', fontSize: '16px' }}
              onClick={handleGenerateVideo}
              disabled={isUploading || !videoSrc}
            >
              <Sparkles size={20} />
              <span>Generate 1080×1920 MP4</span>
            </button>
          </div>
        </aside>

        {/* Right Preview Column */}
        <main className="preview-area">
          <Preview
            videoSrc={videoSrc}
            caption={caption}
            highlightText={highlightText}
            font={font}
            fontSize={fontSize}
            minFontSize={34}
            defaultColor={defaultColor}
            highlightColor={highlightColor}
            align={align}
            fit={fit}
            verticalAlign={verticalAlign}
            logoSrc={logoSrc}
            twibbonSrc={twibbonSrc}
            logoEnabled={logoEnabled}
            twibbonEnabled={twibbonEnabled}
            textStroke={textStroke}
            template={template}
            durationSec={videoMeta?.duration || 4}
          />
        </main>
      </div>

      {/* Generation Progress & Output Modal */}
      <GenerateModal
        isOpen={isRenderModalOpen}
        status={renderStatus}
        progress={renderProgress}
        message={renderMessage}
        outputFilename={outputFilename}
        outputPath={outputPath}
        error={renderError}
        onClose={() => setIsRenderModalOpen(false)}
        onOpenFolder={handleOpenFolder}
        onOpenVideo={handleOpenVideo}
      />
    </div>
  );
}

export default App;
