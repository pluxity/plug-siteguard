import { useCallback, useRef } from 'react';

import { Skeleton } from '@plug-siteguard/ui';
import { Maximize } from 'lucide-react';

import { useCCTVStream } from '@/lib/webrtc';

interface CCTVWebRTCProps {
  streamId: string;
  className?: string;
  autoConnect?: boolean;
}

export default function CCTVWebRTC({ streamId, className, autoConnect = true }: CCTVWebRTCProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoRef, status } = useCCTVStream(streamId, autoConnect);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'idle';
  const isFailed = status === 'failed';

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

      {isConnecting && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )}

      {isFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <span className="text-red-400 text-sm font-medium">연결 실패</span>
          <span className="text-gray-500 text-xs mt-1">현장 접속 장애</span>
        </div>
      )}

      {isConnected && (
        <>
          <div className="absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-xs text-white flex items-center gap-1">
            <span className="text-purple-400 font-semibold">WebRTC</span>
            <span>|</span>
            {streamId}
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
  );
}
