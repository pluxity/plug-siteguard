import { Skeleton } from '@plug-siteguard/ui';

import { useHLSStream } from '../../../lib/hls';

interface CCTVHLSProps {
  streamId: string;
  className?: string;
  autoLoad?: boolean;
  showStats?: boolean;
}

export default function CCTVHLS({
  streamId,
  className,
  autoLoad = true,
  showStats = false,
}: CCTVHLSProps) {
  const { videoRef, status, error, stats } = useHLSStream(streamId, autoLoad);

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading' || status === 'idle';
  const isBuffering = status === 'buffering';
  const isError = status === 'error';

  return (
    <div
      className={`aspect-video bg-gray-900 rounded-lg overflow-hidden relative ${className ?? ''}`}
    >
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <span className="text-red-400 text-xs block">연결 실패</span>
          <span className="text-gray-600 text-xs">{error || streamId}</span>
        </div>
      )}

      {isPlaying && (
        <>
          <div className="absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {streamId}
          </div>

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
