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
      background: 'rgba(3, 4, 7, 0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(18, 22, 32, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid var(--glass-border-hover)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: 'var(--glass-specular), 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(99, 102, 241, 0.15)',
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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
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
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)'
            }}>
              <Loader2 size={22} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}

          {isFinished && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
            }}>
              <CheckCircle2 size={22} />
            </div>
          )}

          {isError && (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              flexShrink: 0,
            }}>
              <AlertCircle size={22} />
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              {isLoading && 'Mengekspor Video 9:16...'}
              {isFinished && 'Video Selesai Diekspor!'}
              {isError && 'Gagal Mengekspor'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
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
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '6px'
            }}>
              <span>Progress Render</span>
              <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{Math.round((progress || 0) * 100)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.round((progress || 0) * 100))}%`,
                background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                borderRadius: '999px',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)'
              }} />
            </div>
          </div>
        )}

        {/* Completed Output Info Card */}
        {isFinished && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'var(--glass-specular-subtle)'
          }}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Tersimpan di Folder Outputs:
            </span>
            <span style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#34d399',
              wordBreak: 'break-all',
              fontFamily: 'monospace'
            }}>
              {outputFilename}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              1080 × 1920 (9:16) • H.264 + AAC Audio
            </span>
          </div>
        )}

        {/* Error Info Card */}
        {isError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '12.5px',
            color: '#fca5a5'
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
                <FolderOpen size={15} /> Buka Folder
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
