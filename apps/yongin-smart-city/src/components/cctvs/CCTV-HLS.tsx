import { useCallback, useRef } from 'react';

import { Skeleton, Spinner } from '@plug-siteguard/ui';
import { Maximize } from 'lucide-react';

import { useHLSStream } from '@/lib/hls';

interface CCTVHLSProps {
  streamId: string;
  className?: string;
  autoLoad?: boolean;
  showStats?: boolean;
  hasPTZ?: boolean;
  gridSize?: '1x1' | '2x2' | '1+5' | '4x4' | '8x8';
}

export default function CCTVHLS({
  streamId,
  className,
  autoLoad = true,
  showStats = false,
  hasPTZ = false,
  gridSize = '2x2',
}: CCTVHLSProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoRef, status, stats } = useHLSStream(streamId, autoLoad);

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading' || status === 'idle';
  const isBuffering = status === 'buffering';
  const isError = status === 'error';

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`h-full bg-gray-900 rounded-lg overflow-hidden relative group ${className ?? ''}`}
    >
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
          <Skeleton className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Spinner size="xl" className="text-green-500 mb-2" />
            <span className="text-green-400 text-sm font-medium">{streamId}</span>
          </div>
        </div>
      )}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 border-2 border-red-500/50">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
          </div>
          <span className="text-red-400 text-sm font-medium">{streamId}</span>
          <span className="text-gray-500 text-xs mt-1">연결 실패</span>
        </div>
      )}

      {isPlaying && (
        <>
          {/* Stream name - hidden on 8x8 grid, smaller on 4x4 */}
          {gridSize !== '8x8' && (
            <div className={`absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-white flex items-center gap-1 ${
              gridSize === '4x4' ? 'text-[10px]' : 'text-xs'
            }`}>
              <span className={`bg-green-500 rounded-full animate-pulse ${
                gridSize === '4x4' ? 'w-1.5 h-1.5' : 'w-2 h-2'
              }`} />
              {streamId}
            </div>
          )}

          {/* PTZ badge - smaller on 4x4/8x8, hover-only on 8x8 */}
          {hasPTZ && (
            <div className={`absolute top-1 left-1 bg-blue-600/90 px-2 py-0.5 rounded text-white font-medium ${
              gridSize === '8x8'
                ? 'text-[9px] opacity-0 group-hover:opacity-100 transition-opacity'
                : gridSize === '4x4'
                ? 'text-[10px]'
                : 'text-xs'
            }`}>
              PTZ
            </div>
          )}

          <button
            onClick={handleFullscreen}
            className="absolute bottom-1 right-1 bg-black/50 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            title="전체화면"
          >
            <Maximize size={gridSize === '8x8' ? 12 : 14} />
          </button>

          {showStats && (
            <div className="absolute top-1 right-1 bg-black/70 px-2 py-1 rounded text-xs text-white space-y-0.5">
              <div>Bitrate: {stats.bitrate.toFixed(0)} kbps</div>
              <div>Buffer: {stats.bufferLength.toFixed(1)}s</div>
              {stats.droppedFrames > 0 && (
                <div className="text-yellow-400">Dropped: {stats.droppedFrames}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
