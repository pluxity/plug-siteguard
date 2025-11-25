import { useCallback, useEffect, useRef } from 'react';

import { StreamStatus, useWebRTCStore } from './store';

interface UseCCTVStreamReturn {
  status: StreamStatus;
  stream: MediaStream | null;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  connect: () => void;
  disconnect: () => void;
}

export function useCCTVStream(streamId: string, autoConnect = true): UseCCTVStreamReturn {
  const videoRef = useRef<HTMLVideoElement>(null);

  const streamState = useWebRTCStore((state) => state.streams.get(streamId));
  const connectStream = useWebRTCStore((state) => state.connectStream);
  const disconnectStream = useWebRTCStore((state) => state.disconnectStream);

  const status = streamState?.status ?? 'idle';
  const stream = streamState?.remoteStream ?? null;
  const error = streamState?.error ?? null;

  useEffect(() => {
    if (autoConnect && streamId) {
      connectStream(streamId);
    }
  }, [streamId, autoConnect, connectStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject === stream) return;

    video.srcObject = stream;
    video.play().catch(() => {});

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  const connect = useCallback(() => {
    connectStream(streamId);
  }, [streamId, connectStream]);

  const disconnect = useCallback(() => {
    disconnectStream(streamId);
  }, [streamId, disconnectStream]);

  return {
    status,
    stream,
    error,
    videoRef,
    connect,
    disconnect,
  };
}

export function useCCTVList() {
  const cctvList = useWebRTCStore((state) => state.cctvList);
  const loading = useWebRTCStore((state) => state.cctvLoading);

  return { cctvList, loading };
}

export function useWebSocketStatus() {
  const connected = useWebRTCStore((state) => state.wsConnected);
  return { connected };
}
