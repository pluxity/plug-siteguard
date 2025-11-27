import { useCallback, useEffect, useRef } from 'react';

import { useHLSStore } from './store';
import { HLSConfig, HLSStats, HLSStreamStatus } from './types';

interface UseHLSStreamReturn {
  status: HLSStreamStatus;
  error: string | null;
  stats: HLSStats;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  load: () => void;
  destroy: () => void;
}

export function useHLSStream(streamId: string, autoLoad = true): UseHLSStreamReturn {
  const videoRef = useRef<HTMLVideoElement>(null);

  const streamState = useHLSStore((state) => state.streams.get(streamId));
  const loadStream = useHLSStore((state) => state.loadStream);
  const destroyStream = useHLSStore((state) => state.destroyStream);

  const status = streamState?.status ?? 'idle';
  const error = streamState?.error ?? null;
  const stats = streamState?.stats ?? {
    bytesLoaded: 0,
    bitrate: 0,
    bufferLength: 0,
    droppedFrames: 0,
  };

  useEffect(() => {
    const video = videoRef.current;
    if (autoLoad && streamId && video) {
      loadStream(streamId, video);
    }

    return () => {
      if (streamId) {
        destroyStream(streamId);
      }
    };
  }, [streamId, autoLoad, loadStream, destroyStream]);

  const load = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      loadStream(streamId, video);
    }
  }, [streamId, loadStream]);

  const destroy = useCallback(() => {
    destroyStream(streamId);
  }, [streamId, destroyStream]);

  return {
    status,
    error,
    stats,
    videoRef,
    load,
    destroy,
  };
}

export function useHLSConfig() {
  const config = useHLSStore((state) => state.config);
  const setConfig = useHLSStore((state) => state.setConfig);

  const updateConfig = useCallback(
    (newConfig: HLSConfig) => {
      setConfig(newConfig);
    },
    [setConfig]
  );

  return { config, updateConfig };
}

export function useHLSCleanup() {
  const destroyAll = useHLSStore((state) => state.destroyAll);

  useEffect(() => {
    return () => {
      destroyAll();
    };
  }, [destroyAll]);
}
