import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, FolderOpen, Play, X } from 'lucide-react';

export const GenerateModal = ({
  isOpen,
  status, // 'idle' | 'preparing' | 'bundling' | 'rendering' | 'completed' | 'error'
  progress, // 0 to 1
  message,
  outputFilename,
  outputPath,
  error,
  onClose,
  onOpenFolder,
  onOpenVideo,
}) => {
  if (!isOpen) return null;

  const isFinished = status === 'completed';
  const isError = status === 'error';
  const isLoading = !isFinished && !isError;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 25, 47, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1.5px solid rgba(217, 119, 6, 0.35)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 30px 80px rgba(10, 25, 47, 0.35), 0 0 40px rgba(245, 158, 11, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        position: 'relative',
      }}>
        {/* Close Button */}
        {(isFinished || isError) && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Header / Status Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isLoading && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1.5px solid rgba(217, 119, 6, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(217, 119, 6, 0.25)'
            }}>
              <Loader2 size={22} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}

          {isFinished && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(5, 150, 105, 0.15)',
              border: '1.5px solid rgba(5, 150, 105, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(5, 150, 105, 0.25)'
            }}>
              <CheckCircle2 size={22} />
            </div>
          )}

          {isError && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(225, 29, 72, 0.15)',
              border: '1.5px solid rgba(225, 29, 72, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e11d48',
              flexShrink: 0,
            }}>
              <AlertCircle size={22} />
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0a192f', letterSpacing: '-0.01em' }}>
              {isLoading && 'Mengekspor Video 9:16...'}
              {isFinished && 'Video Selesai Diekspor!'}
              {isError && 'Gagal Mengekspor'}
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
              {message || (isLoading ? 'Memproses render Remotion MP4...' : '')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#0a192f',
              marginBottom: '6px'
            }}>
              <span>Progress Render</span>
              <span style={{ color: '#d97706', fontWeight: 800 }}>{Math.round((progress || 0) * 100)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.round((progress || 0) * 100))}%`,
                background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                borderRadius: '999px',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 12px rgba(217, 119, 6, 0.6)'
              }} />
            </div>
          </div>
        )}

        {/* Completed Output Info Card */}
        {isFinished && (
          <div style={{
            background: 'rgba(241, 245, 249, 0.95)',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(10, 25, 47, 0.04)'
          }}>
            <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Tersimpan di Folder Outputs:
            </span>
            <span style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: '#059669',
              wordBreak: 'break-all',
              fontFamily: 'monospace'
            }}>
              {outputFilename}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              1080 × 1920 (9:16) • H.264 + AAC Audio
            </span>
          </div>
        )}

        {/* Error Info Card */}
        {isError && (
          <div style={{
            background: 'rgba(225, 29, 72, 0.1)',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '12.5px',
            color: '#e11d48'
          }}>
            {error || 'Terjadi kesalahan saat rendering.'}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          {isFinished && (
            <>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
                onClick={() => onOpenVideo(outputFilename)}
              >
                <Play size={15} /> Putar Video
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
                onClick={onOpenFolder}
              >
                <FolderOpen size={15} style={{ color: '#d97706' }} /> Buka Folder
              </button>
            </>
          )}

          {isError && (
            <button className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>
              Tutup
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
