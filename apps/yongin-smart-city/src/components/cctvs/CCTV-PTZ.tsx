import { useCallback, useRef, useState } from 'react';

import { Skeleton } from '@plug-siteguard/ui';
import { Maximize } from 'lucide-react';

import { useWHEPStream } from '@/lib/whep';
import PTZControls from './PTZControls';

interface CCTVPTZProps {
  streamPath: string;
  cameraId: string;
  className?: string;
  autoConnect?: boolean;
  ptzSpeed?: number;
}

export default function CCTVPTZ({
  streamPath,
  cameraId,
  className,
  autoConnect = true,
  ptzSpeed = 40,
}: CCTVPTZProps) {
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
      <div className="flex-1 relative">
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
            <div className="absolute inset-0">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <span className="text-red-400 text-sm font-medium">연결 실패</span>
              <span className="text-gray-500 text-xs mt-1">현장 접속 장애</span>
            </div>
          )}

          {isConnected && (
            <>
              <div className="absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-orange-400 font-semibold">PTZ</span>
                <span>|</span>
                {streamPath}
              </div>

              <button
                onClick={handleFullscreen}
                className="absolute bottom-1 right-1 bg-black/50 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                title="전체화면"
              >
                <Maximize size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* PTZ 컨트롤 영역 */}
      <div className="w-72 h-full">
        <PTZControls cameraId={cameraId} speed={ptzSpeed} />
      </div>
    </div>
  );
}
