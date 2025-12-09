import { useCallback, useRef, useState } from 'react';

import { Skeleton, Spinner } from '@plug-siteguard/ui';
import { Maximize } from 'lucide-react';

import { useWHEPStream } from '@/lib/whep';
import PTZControls from './PTZControls';

interface CCTVWHEPProps {
  streamPath: string;
  className?: string;
  autoConnect?: boolean;
  hasPTZ?: boolean;
  gridSize?: '1x1' | '2x2' | '1+5' | '4x4' | '8x8';
  showPTZControls?: boolean;
  ptzSpeed?: number;
}

export default function CCTVWHEP({
  streamPath,
  className,
  autoConnect = true,
  hasPTZ = false,
  gridSize = '2x2',
  showPTZControls = false,
  ptzSpeed = 10,
}: CCTVWHEPProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoRef, status } = useWHEPStream(streamPath, autoConnect);
  const [videoReady, setVideoReady] = useState(false);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'idle';
  const isError = status === 'failed';
  const isLoading = isConnecting || (isConnected && !videoReady);

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  return (
    <div className={`h-full flex gap-4 ${className ?? ''}`}>
      {/* CCTV 비디오 영역 */}
      <div className={showPTZControls ? 'flex-1 relative' : 'w-full h-full relative'}>
        <div
          ref={containerRef}
          className="h-full bg-gray-900 rounded-lg overflow-hidden relative group"
        >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
        onLoadedData={() => setVideoReady(true)}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center">
          <Skeleton className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Spinner size="xl" className="text-green-500 mb-2" />
            <span className="text-green-400 text-sm font-medium">{streamPath}</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 border-2 border-red-500/50">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
          </div>
          <span className="text-red-400 text-sm font-medium">{streamPath}</span>
          <span className="text-gray-500 text-xs mt-1">연결 실패</span>
        </div>
      )}

      {isConnected && (
        <>
          {/* Stream name - hidden on 8x8 grid, smaller on 4x4 */}
          {gridSize !== '8x8' && (
            <div className={`absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-white flex items-center gap-1 ${
              gridSize === '4x4' ? 'text-[10px]' : 'text-xs'
            }`}>
              <span className={`bg-green-500 rounded-full animate-pulse ${
                gridSize === '4x4' ? 'w-1.5 h-1.5' : 'w-2 h-2'
              }`} />
              {streamPath}
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
        </>
      )}
        </div>
      </div>

      {/* PTZ 컨트롤 영역 */}
      {showPTZControls && (
        <div className="w-72 h-full">
          <PTZControls cameraId={streamPath} speed={ptzSpeed} />
        </div>
      )}
    </div>
  );
}
