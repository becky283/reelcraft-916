import React, { useRef, useState } from 'react';
import { Upload, Video, CheckCircle2, Music, AlertCircle, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const VideoUploader = ({
  videoSrc,
  videoMeta,
  samples = [],
  onSelectVideo,
  onSelectSample,
  isUploading,
  muted = false,
  onChangeMuted,
  volume = 1.0,
  onChangeVolume,
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectVideo(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onSelectVideo(file);
    }
  };

  const formatDuration = (sec) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getAspectRatioLabel = (w, h) => {
    if (!w || !h) return 'Standard';
    const ratio = w / h;
    if (Math.abs(ratio - 16 / 9) < 0.1) return '16:9 Landscape';
    if (Math.abs(ratio - 9 / 16) < 0.1) return '9:16 Portrait';
    if (Math.abs(ratio - 1) < 0.1) return '1:1 Square';
    if (Math.abs(ratio - 4 / 5) < 0.1) return '4:5 Feed';
    return `${w}×${h}`;
  };

  return (
    <div className="control-card">
      <div className="card-title">
        <Video size={16} />
        <span>Video Source</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
        style={{ display: 'none' }}
      />

      {/* Dropzone Area */}
      <div
        className={`dropzone-box ${isDragOver ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <Upload size={20} />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
              {isUploading ? 'Uploading & Analyzing...' : 'Choose Video from Computer'}
            </span>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
              Drag and drop MP4, MOV, or WEBM
            </p>
          </div>
        </div>
      </div>

      {/* Selected Video Metadata & Audio Controls */}
      {videoMeta && (
        <div style={{
          background: 'rgba(31, 36, 45, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '260px'
            }}>
              {videoMeta.originalName || videoMeta.filename || 'Input Video'}
            </span>
            <span className="badge badge-success">
              <CheckCircle2 size={12} /> Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge">
              {getAspectRatioLabel(videoMeta.width, videoMeta.height)}
            </span>
            <span className="badge">
              {videoMeta.width} × {videoMeta.height}
            </span>
            <span className="badge">
              {formatDuration(videoMeta.duration)}
            </span>
            {videoMeta.hasAudio && (
              <span className="badge" style={{ color: muted ? '#f87171' : '#34d399', borderColor: muted ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)' }}>
                {muted ? <VolumeX size={11} /> : <Music size={11} />}
                {muted ? 'Audio Muted' : 'Audio (AAC)'}
              </span>
            )}
          </div>

          {/* Audio Sound Toggle & Volume Bar */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onChangeMuted && onChangeMuted(!muted)}
                  style={{
                    background: muted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    border: muted ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.4)',
                    color: muted ? '#f87171' : '#34d399',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{muted ? 'Audio Video: DIMATIKAN (Muted)' : 'Audio Video: AKTIF (Bersuara)'}</span>
                </button>
              </div>

              <span style={{ fontSize: '11px', color: muted ? '#f87171' : '#9ca3af' }}>
                {muted ? 'Hening / Tanpa Suara' : `${Math.round((volume ?? 1) * 100)}% Volume`}
              </span>
            </div>

            {/* Optional Volume Slider if not muted */}
            {!muted && onChangeVolume && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume ?? 1}
                  onChange={(e) => onChangeVolume(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#6366f1' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Test Samples */}
      {samples.length > 0 && (
        <div>
          <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>
            Or try quick built-in test video:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {samples.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSample(s)}
                style={{
                  background: videoSrc === s.url ? '#374151' : 'var(--bg-input)',
                  border: videoSrc === s.url ? '1px solid #818cf8' : '1px solid var(--border-color)',
                  color: videoSrc === s.url ? '#fff' : '#d1d5db',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={12} />
                {s.filename.replace('sample-', '').replace('.mp4', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
