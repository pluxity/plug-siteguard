import { useCallback, useEffect, useRef } from 'react';
import { useWHEPStore } from './store';
import type { WHEPStreamStatus } from './store';

/**
 * WHEP 스트림 연결 훅 (Store 기반)
 * @param streamId 스트림 ID
 * @param autoConnect 자동 연결 여부 (기본값: true)
 */
export function useWHEPStream(streamId: string, autoConnect = true) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const stream = useWHEPStore((state) => state.streams.get(streamId));
  const connectStream = useWHEPStore((state) => state.connectStream);
  const disconnectStream = useWHEPStore((state) => state.disconnectStream);

  const status: WHEPStreamStatus = stream?.status ?? 'idle';
  const error = stream?.error ?? null;
  const remoteStream = stream?.remoteStream ?? null;

  // 비디오 엘리먼트에 스트림 연결
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
      videoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && streamId) {
      connectStream(streamId);
    }

    return () => {
      // 컴포넌트 언마운트 시 연결 해제하지 않음 (Store에서 관리)
      // 필요시 명시적으로 disconnectStream 호출
    };
  }, [streamId, autoConnect, connectStream]);

  const connect = useCallback(() => {
    connectStream(streamId);
  }, [streamId, connectStream]);

  const disconnect = useCallback(() => {
    disconnectStream(streamId);
  }, [streamId, disconnectStream]);

  return { status, error, videoRef, connect, disconnect };
}

/**
 * CCTV 리스트 조회 훅 (Store 기반)
 */
export function useCCTVList() {
  const cctvList = useWHEPStore((state) => state.cctvList);
  const loading = useWHEPStore((state) => state.cctvLoading);
  const totalStreamCount = useWHEPStore((state) => state.totalStreamCount);
  const initialized = useWHEPStore((state) => state.initialized);
  const initialize = useWHEPStore((state) => state.initialize);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return { cctvList, loading, totalStreamCount };
}

/**
 * WHEP Store 전체 cleanup 훅
 */
export function useWHEPCleanup() {
  const cleanup = useWHEPStore((state) => state.cleanup);
  return cleanup;
}
