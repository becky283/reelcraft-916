import React, { useRef, useState } from 'react';
import { Upload, Video, CheckCircle2, Music, Sparkles, Volume2, VolumeX } from 'lucide-react';

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
        <Video size={16} style={{ color: '#d97706' }} />
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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1.5px solid rgba(217, 119, 6, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706',
            boxShadow: '0 2px 10px rgba(217, 119, 6, 0.15)'
          }}>
            <Upload size={18} />
          </div>
          <div>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0a192f' }}>
              {isUploading ? 'Uploading & Analyzing...' : 'Pilih Video dari Komputer'}
            </span>
            <p style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
              Drag and drop MP4, MOV, atau WEBM
            </p>
          </div>
        </div>
      </div>

      {/* Selected Video Metadata & Audio Controls */}
      {videoMeta && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #cbd5e1',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0a192f',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '260px'
            }}>
              {videoMeta.originalName || videoMeta.filename || 'Input Video'}
            </span>
            <span className="badge badge-success">
              <CheckCircle2 size={11} /> Ready
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
              <span className="badge" style={{ color: muted ? '#e11d48' : '#059669', borderColor: muted ? 'rgba(225, 29, 72, 0.3)' : 'rgba(5, 150, 105, 0.3)' }}>
                {muted ? <VolumeX size={11} /> : <Music size={11} />}
                {muted ? 'Muted' : 'Audio AAC'}
              </span>
            )}
          </div>

          {/* Audio Sound Toggle & Volume Bar */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '9px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => onChangeMuted && onChangeMuted(!muted)}
                style={{
                  background: muted ? 'rgba(225, 29, 72, 0.1)' : 'rgba(10, 25, 47, 0.06)',
                  border: muted ? '1px solid rgba(225, 29, 72, 0.4)' : '1px solid #cbd5e1',
                  color: muted ? '#e11d48' : '#0a192f',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} style={{ color: '#d97706' }} />}
                <span>{muted ? 'Audio: DIMATIKAN (Hening)' : 'Audio: AKTIF'}</span>
              </button>

              <span style={{ fontSize: '11.5px', fontWeight: 600, color: muted ? '#e11d48' : '#64748b' }}>
                {muted ? 'Tanpa Suara' : `${Math.round((volume ?? 1) * 100)}% Volume`}
              </span>
            </div>

            {/* Optional Volume Slider if not muted */}
            {!muted && onChangeVolume && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b' }}>Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume ?? 1}
                  onChange={(e) => onChangeVolume(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Test Samples */}
      {samples.length > 0 && (
        <div>
          <label style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '5px' }}>
            Video Contoh:
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {samples.map((s, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-secondary"
                onClick={() => onSelectSample(s)}
                style={{
                  background: videoSrc === s.url ? 'rgba(245, 158, 11, 0.12)' : undefined,
                  borderColor: videoSrc === s.url ? '#d97706' : undefined,
                  color: videoSrc === s.url ? '#b45309' : undefined,
                  padding: '4px 8px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                }}
              >
                <Sparkles size={11} style={{ color: '#d97706' }} />
                {s.filename.replace('sample-', '').replace('.mp4', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
