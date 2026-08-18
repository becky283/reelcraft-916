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
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '28px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Header / Status Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isLoading && (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              flexShrink: 0
            }}>
              <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}

          {isFinished && (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              flexShrink: 0
            }}>
              <CheckCircle2 size={24} />
            </div>
          )}

          {isError && (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              flexShrink: 0
            }}>
              <AlertCircle size={24} />
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
              {isLoading && 'Generating 9:16 Video...'}
              {isFinished && 'Video Export Ready!'}
              {isError && 'Generation Failed'}
            </h3>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
              {message || (isLoading ? 'Processing Remotion video render...' : '')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#d1d5db',
              marginBottom: '6px'
            }}>
              <span>Progress</span>
              <span>{Math.round((progress || 0) * 100)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--bg-input)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.round((progress || 0) * 100))}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        {/* Completed Output Info Card */}
        {isFinished && (
          <div style={{
            background: 'rgba(31, 36, 45, 0.6)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Saved To Local Outputs:
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#34d399',
              wordBreak: 'break-all',
              fontFamily: 'monospace'
            }}>
              {outputFilename}
            </span>
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              Format: 1080 × 1920 (9:16) • H.264 + AAC Audio
            </span>
          </div>
        )}

        {/* Error Info Card */}
        {isError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '13px',
            color: '#fca5a5'
          }}>
            {error || 'An unexpected error occurred during rendering.'}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          {isFinished && (
            <>
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => onOpenVideo(outputFilename)}
              >
                <Play size={16} /> Play Video
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={onOpenFolder}
              >
                <FolderOpen size={16} /> Open Folder
              </button>
            </>
          )}

          {isError && (
            <button className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>
              Close
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
