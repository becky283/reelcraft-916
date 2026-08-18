import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TemplateManager } from './components/TemplateManager';
import { VideoUploader } from './components/VideoUploader';
import { VideoFitControls } from './components/VideoFitControls';
import { GradientControls } from './components/GradientControls';
import { CaptionEditor } from './components/CaptionEditor';
import { StyleControls } from './components/StyleControls';
import { BrandingControls } from './components/BrandingControls';
import { Preview } from './components/Preview';
import { GenerateModal } from './components/GenerateModal';
import { Play, Sparkles, FolderOpen, Film, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import defaultTemplate from '../templates/main-template.json';

const STORAGE_KEY = 'auto_editor_user_settings_v6';

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

  // Template State
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(saved.activeTemplateId || 'main-template');
  const [isSimpleMode, setIsSimpleMode] = useState(saved.isSimpleMode ?? true);

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

  // Video Fit & Position State
  const [videoY, setVideoY] = useState(saved.videoY ?? 0);
  const [videoHeight, setVideoHeight] = useState(saved.videoHeight ?? 1920);
  const [videoScale, setVideoScale] = useState(saved.videoScale ?? 1.0);
  const [fit, setFit] = useState(saved.fit || 'cover');
  const [verticalAlign, setVerticalAlign] = useState(saved.verticalAlign || 'center');
  const [backdropBlur, setBackdropBlur] = useState(saved.backdropBlur ?? true);

  // Gradient Fades State
  const [topGradientHeight, setTopGradientHeight] = useState(saved.topGradientHeight ?? 0);
  const [bottomGradientHeight, setBottomGradientHeight] = useState(saved.bottomGradientHeight ?? 380);
  const [gradientColor, setGradientColor] = useState(saved.gradientColor || '#000000');
  const [gradientOpacity, setGradientOpacity] = useState(saved.gradientOpacity ?? 1.0);

  // Caption State
  const [caption, setCaption] = useState(saved.caption ?? 'JIM CRAMER: BITCOIN TIDAK BAIK-BAIK SAJA SEGERA JUAL!');
  const [highlightWords, setHighlightWords] = useState(saved.highlightWords || ['JIM', 'CRAMER:']);
  const [highlightText, setHighlightText] = useState(saved.highlightText ?? '');
  const [defaultColor, setDefaultColor] = useState(saved.defaultColor || '#FFFFFF');
  const [highlightColor, setHighlightColor] = useState(saved.highlightColor || '#FFD600');
  const [uppercase, setUppercase] = useState(saved.uppercase ?? true);
  const [textStroke, setTextStroke] = useState(saved.textStroke || 'none');
  const [captionY, setCaptionY] = useState(saved.captionY ?? 1120);

  // Style State
  const [font, setFont] = useState(saved.font || 'Montserrat ExtraBold');
  const [fontSize, setFontSize] = useState(saved.fontSize || 64);
  const [align, setAlign] = useState(saved.align || 'center');

  // Branding State
  const [twibbonEnabled, setTwibbonEnabled] = useState(saved.twibbonEnabled ?? true);
  const [twibbonSrc, setTwibbonSrc] = useState(saved.twibbonSrc || '/assets/twibbon.png');
  const [logoEnabled, setLogoEnabled] = useState(saved.logoEnabled ?? true);
  const [logoSrc, setLogoSrc] = useState(saved.logoSrc || '/assets/logo.png');
  const [logoWidth, setLogoWidth] = useState(saved.logoWidth ?? 240);
  const [logoY, setLogoY] = useState(saved.logoY ?? 980);

  // Outputs State
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
        activeTemplateId,
        isSimpleMode,
        font,
        fontSize,
        align,
        defaultColor,
        highlightColor,
        highlightWords,
        highlightText,
        uppercase,
        textStroke,
        captionY,
        fit,
        verticalAlign,
        videoY,
        videoHeight,
        videoScale,
        backdropBlur,
        topGradientHeight,
        bottomGradientHeight,
        gradientColor,
        gradientOpacity,
        twibbonEnabled,
        twibbonSrc,
        logoEnabled,
        logoSrc,
        logoWidth,
        logoY,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (e) {}
  }, [activeTemplateId, isSimpleMode, font, fontSize, align, defaultColor, highlightColor, highlightWords, highlightText, uppercase, textStroke, captionY, fit, verticalAlign, videoY, videoHeight, videoScale, backdropBlur, topGradientHeight, bottomGradientHeight, gradientColor, gradientOpacity, twibbonEnabled, twibbonSrc, logoEnabled, logoSrc, logoWidth, logoY]);

  // Fetch initial backend data (templates, samples, outputs)
  const refreshData = useCallback(async () => {
    try {
      const tmplRes = await fetch('/api/templates');
      if (tmplRes.ok) {
        const data = await tmplRes.json();
        if (data.templates && data.templates.length > 0) {
          setTemplates(data.templates);
        }
      }

      const sampleRes = await fetch('/api/samples');
      if (sampleRes.ok) {
        const data = await sampleRes.json();
        if (data.samples && data.samples.length > 0) {
          setSamples(data.samples);
          if (!videoSrc) {
            setVideoSrc(data.samples[0].url);
            setVideoMeta(data.samples[0]);
          }
        }
      }

      const outRes = await fetch('/api/outputs');
      if (outRes.ok) {
        const data = await outRes.json();
        setOutputsList(data.outputs || []);
      }
    } catch (e) {
      console.warn('Backend offline or not yet ready:', e.message);
    }
  }, [videoSrc]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Apply Template Settings to State
  const applyTemplateToState = (t) => {
    if (!t) return;
    if (t.video) {
      setVideoY(t.video.y ?? 0);
      setVideoHeight(t.video.height ?? 1920);
      setVideoScale(t.video.scale ?? 1.0);
      setFit(t.video.fit || 'cover');
      setVerticalAlign(t.video.verticalAlign || 'center');
      setBackdropBlur(t.video.backdropBlur ?? true);
    }
    if (t.gradient) {
      setTopGradientHeight(t.gradient.topHeight ?? 0);
      setBottomGradientHeight(t.gradient.bottomHeight ?? 380);
      setGradientColor(t.gradient.color || '#000000');
      setGradientOpacity(t.gradient.opacity ?? 1.0);
    }
    if (t.caption) {
      setFont(t.caption.font || 'Montserrat ExtraBold');
      setFontSize(t.caption.fontSize || 64);
      setDefaultColor(t.caption.defaultColor || '#FFFFFF');
      setHighlightColor(t.caption.highlightColor || '#FFD600');
      setAlign(t.caption.align || 'center');
      setCaptionY(t.caption.y ?? 1120);
      setTextStroke(t.caption.textStroke || 'none');
      if (t.caption.uppercase !== undefined) setUppercase(t.caption.uppercase);
    }
    if (t.logo) {
      setLogoEnabled(t.logo.enabled !== false);
      if (t.logo.path) setLogoSrc(t.logo.path);
      setLogoWidth(t.logo.width || 240);
      setLogoY(t.logo.y ?? 980);
    }
    if (t.twibbon) {
      const isString = typeof t.twibbon === 'string';
      setTwibbonEnabled(isString ? true : (t.twibbon.enabled !== false));
      const p = isString ? t.twibbon : t.twibbon.path;
      if (p) setTwibbonSrc(p);
    }
  };

  // Switch Template
  const handleSelectTemplate = async (templateId) => {
    setActiveTemplateId(templateId);
    try {
      const res = await fetch(`/api/template?id=${templateId}`);
      if (res.ok) {
        const t = await res.json();
        applyTemplateToState(t);
      }
    } catch (e) {
      console.error('Error loading template:', e);
    }
  };

  // Save Current Settings as New Template Preset
  const handleSaveNewTemplate = async (name) => {
    try {
      const templateData = {
        name,
        canvas: { width: 1080, height: 1920, fps: 30 },
        video: {
          x: 0,
          y: videoY,
          width: 1080,
          height: videoHeight,
          scale: videoScale,
          fit,
          verticalAlign,
          backdropBlur,
        },
        gradient: {
          topHeight: topGradientHeight,
          bottomHeight: bottomGradientHeight,
          color: gradientColor,
          opacity: gradientOpacity,
        },
        caption: {
          font,
          fontSize,
          minFontSize: 34,
          defaultColor,
          highlightColor,
          align,
          y: captionY,
          width: 880,
          maxHeight: 500,
          textStroke,
          uppercase,
        },
        logo: {
          enabled: logoEnabled,
          path: logoSrc,
          width: logoWidth,
          height: Math.round(logoWidth * 0.55),
          y: logoY,
          x: Math.round((1080 - logoWidth) / 2),
        },
        twibbon: {
          enabled: twibbonEnabled,
          path: twibbonSrc,
        },
        backgroundColor: '#000000',
      };

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveTemplateId(data.template.id);
        refreshData();
      }
    } catch (e) {
      console.error('Failed to save new template:', e);
    }
  };

  // Update Current Template Preset
  const handleUpdateCurrentTemplate = async () => {
    const current = templates.find((t) => t.id === activeTemplateId) || templates[0];
    const name = current?.name || 'Main 9:16 Branded Template';
    const id = activeTemplateId || 'main-template';

    try {
      const templateData = {
        id,
        name,
        canvas: { width: 1080, height: 1920, fps: 30 },
        video: {
          x: 0,
          y: videoY,
          width: 1080,
          height: videoHeight,
          scale: videoScale,
          fit,
          verticalAlign,
          backdropBlur,
        },
        gradient: {
          topHeight: topGradientHeight,
          bottomHeight: bottomGradientHeight,
          color: gradientColor,
          opacity: gradientOpacity,
        },
        caption: {
          font,
          fontSize,
          minFontSize: 34,
          defaultColor,
          highlightColor,
          align,
          y: captionY,
          width: 880,
          maxHeight: 500,
          textStroke,
          uppercase,
        },
        logo: {
          enabled: logoEnabled,
          path: logoSrc,
          width: logoWidth,
          height: Math.round(logoWidth * 0.55),
          y: logoY,
          x: Math.round((1080 - logoWidth) / 2),
        },
        twibbon: {
          enabled: twibbonEnabled,
          path: twibbonSrc,
        },
        backgroundColor: '#000000',
      };

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      if (res.ok) {
        refreshData();
      }
    } catch (e) {
      console.error('Failed to update template:', e);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id) => {
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActiveTemplateId('main-template');
        refreshData();
        handleSelectTemplate('main-template');
      }
    } catch (e) {
      console.error('Failed to delete template:', e);
    }
  };

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

      // Auto-adjust if portrait
      if (data.height > data.width) {
        setVideoY(0);
        setVideoHeight(1920);
        setFit('cover');
      }

      refreshData();
    } catch (err) {
      console.error('Error uploading video:', err);
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
        highlightWords,
        highlightText,
        font,
        fontSize,
        minFontSize: 34,
        defaultColor,
        highlightColor,
        align,
        captionY,
        logoY,
        logoWidth,
        logoSrc,
        twibbonSrc,
        logoEnabled,
        twibbonEnabled,
        textStroke,
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
    if (window.confirm('Reset caption style, gradients, and framing to default presets?')) {
      localStorage.removeItem(STORAGE_KEY);
      setFont('Montserrat ExtraBold');
      setFontSize(64);
      setAlign('center');
      setDefaultColor('#FFFFFF');
      setHighlightColor('#FFD600');
      setHighlightWords(['JIM', 'CRAMER:']);
      setHighlightText('');
      setUppercase(true);
      setTextStroke('none');
      setCaptionY(1120);
      setVideoY(0);
      setVideoHeight(1920);
      setVideoScale(1.0);
      setFit('cover');
      setVerticalAlign('center');
      setBackdropBlur(true);
      setTopGradientHeight(0);
      setBottomGradientHeight(380);
      setGradientColor('#000000');
      setGradientOpacity(1.0);
      setTwibbonEnabled(true);
      setLogoEnabled(true);
      setLogoWidth(240);
      setLogoY(980);
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
          {/* 1. Template Preset Manager */}
          <TemplateManager
            templates={templates}
            activeTemplateId={activeTemplateId}
            onSelectTemplate={handleSelectTemplate}
            onSaveNewTemplate={handleSaveNewTemplate}
            onUpdateCurrentTemplate={handleUpdateCurrentTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            isSimpleMode={isSimpleMode}
            onToggleSimpleMode={setIsSimpleMode}
          />

          {/* 2. Video Picker (Always Visible) */}
          <VideoUploader
            videoSrc={videoSrc}
            videoMeta={videoMeta}
            samples={samples}
            onSelectVideo={handleSelectVideo}
            onSelectSample={handleSelectSample}
            isUploading={isUploading}
          />

          {/* 3. Caption Editor with Click-to-Highlight (Always Visible) */}
          <CaptionEditor
            caption={caption}
            onChangeCaption={setCaption}
            highlightWords={highlightWords}
            onChangeHighlightWords={setHighlightWords}
            highlightText={highlightText}
            onChangeHighlightText={setHighlightText}
            defaultColor={defaultColor}
            onChangeDefaultColor={setDefaultColor}
            highlightColor={highlightColor}
            onChangeHighlightColor={setHighlightColor}
            uppercase={uppercase}
            onToggleUppercase={setUppercase}
            textStroke={textStroke}
            onChangeTextStroke={setTextStroke}
            captionY={captionY}
            onChangeCaptionY={!isSimpleMode ? setCaptionY : undefined}
          />

          {/* Advanced Styling & Positioning Cards (Shown in Full Customize Mode) */}
          {!isSimpleMode && (
            <>
              {/* Video Framing & Position */}
              <VideoFitControls
                fit={fit}
                onChangeFit={setFit}
                verticalAlign={verticalAlign}
                onChangeVerticalAlign={setVerticalAlign}
                videoY={videoY}
                onChangeVideoY={setVideoY}
                videoHeight={videoHeight}
                onChangeVideoHeight={setVideoHeight}
                videoScale={videoScale}
                onChangeVideoScale={setVideoScale}
              />

              {/* Gradient Fades & Blankspace Fill */}
              <GradientControls
                topGradientHeight={topGradientHeight}
                onChangeTopGradientHeight={setTopGradientHeight}
                bottomGradientHeight={bottomGradientHeight}
                onChangeBottomGradientHeight={setBottomGradientHeight}
                gradientColor={gradientColor}
                onChangeGradientColor={setGradientColor}
                gradientOpacity={gradientOpacity}
                onChangeGradientOpacity={setGradientOpacity}
                backdropBlur={backdropBlur}
                onChangeBackdropBlur={setBackdropBlur}
              />

              {/* Typography & Styling */}
              <StyleControls
                font={font}
                onChangeFont={setFont}
                fontSize={fontSize}
                onChangeFontSize={setFontSize}
                align={align}
                onChangeAlign={setAlign}
              />

              {/* Twibbon & Logo Overlays */}
              <BrandingControls
                twibbonEnabled={twibbonEnabled}
                onToggleTwibbon={setTwibbonEnabled}
                twibbonSrc={twibbonSrc}
                logoEnabled={logoEnabled}
                onToggleLogo={setLogoEnabled}
                logoSrc={logoSrc}
                onUploadAsset={handleUploadAsset}
                logoWidth={logoWidth}
                onChangeLogoWidth={setLogoWidth}
                logoY={logoY}
                onChangeLogoY={setLogoY}
              />
            </>
          )}

          {/* Quick Helper in Simple Mode */}
          {isSimpleMode && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed var(--border-color)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>Ingin ubah posisi video/logo/warna template?</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px' }}
                onClick={() => setIsSimpleMode(false)}
              >
                <Sliders size={12} /> Buka Customizer
              </button>
            </div>
          )}

          {/* Big Generate Action Button */}
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
            videoY={videoY}
            videoHeight={videoHeight}
            videoScale={videoScale}
            fit={fit}
            verticalAlign={verticalAlign}
            backdropBlur={backdropBlur}
            topGradientHeight={topGradientHeight}
            bottomGradientHeight={bottomGradientHeight}
            gradientColor={gradientColor}
            gradientOpacity={gradientOpacity}
            caption={caption}
            highlightWords={highlightWords}
            highlightText={highlightText}
            font={font}
            fontSize={fontSize}
            minFontSize={34}
            defaultColor={defaultColor}
            highlightColor={highlightColor}
            align={align}
            captionY={captionY}
            logoY={logoY}
            logoWidth={logoWidth}
            logoSrc={logoSrc}
            twibbonSrc={twibbonSrc}
            logoEnabled={logoEnabled}
            twibbonEnabled={twibbonEnabled}
            textStroke={textStroke}
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
