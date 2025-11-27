import { Skeleton } from '@plug-siteguard/ui';

import { useCCTVStream } from '../../../lib/webrtc';

interface CCTVProps {
  streamId: string;
  className?: string;
  autoConnect?: boolean;
}

export default function CCTVWebRTC({ streamId, className, autoConnect = true }: CCTVProps) {
  const { videoRef, status, error } = useCCTVStream(streamId, autoConnect);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'idle';
  const isFailed = status === 'failed';

  return (
    <div className={`aspect-video bg-gray-900 rounded-lg overflow-hidden relative ${className ?? ''}`}>
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

      {isConnecting && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )}

      {isFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <span className="text-red-400 text-xs block">연결 실패</span>
          <span className="text-gray-600 text-xs">{error || streamId}</span>
        </div>
      )}

      {isConnected && (
        <div className="absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded text-xs text-white">
          {streamId}
        </div>
      )}
    </div>
  );
}
