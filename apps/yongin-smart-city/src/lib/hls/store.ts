import Hls, { ErrorData, FragLoadedData } from 'hls.js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { HLSConfig, HLSStats, HLSStreamState, HLSStreamStatus } from './types';

interface HLSEngineInstance {
  hls: Hls | null;
  videoElement: HTMLVideoElement | null;
  statsInterval: ReturnType<typeof setInterval> | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectAttempts: number;
  lastBytesLoaded: number;
}

interface HLSState {
  config: Required<HLSConfig>;
  streams: Map<string, HLSStreamState>;
  engines: Map<string, HLSEngineInstance>;
}

interface HLSActions {
  setConfig: (config: HLSConfig) => void;
  loadStream: (streamId: string, videoElement: HTMLVideoElement) => void;
  destroyStream: (streamId: string) => void;
  destroyAll: () => void;
}

type HLSStore = HLSState & HLSActions;

const DEFAULT_CONFIG: Required<HLSConfig> = {
  serverUrl: import.meta.env.VITE_HLS_URL || window.location.origin,
  autoReconnect: true,
  reconnectDelay: 5000,
  maxReconnectAttempts: 3,
};

const createStreamState = (streamId: string): HLSStreamState => ({
  streamId,
  status: 'idle',
  error: null,
  stats: {
    bytesLoaded: 0,
    bitrate: 0,
    bufferLength: 0,
    droppedFrames: 0,
  },
});

const createEngineInstance = (): HLSEngineInstance => ({
  hls: null,
  videoElement: null,
  statsInterval: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
  lastBytesLoaded: 0,
});

export const useHLSStore = create<HLSStore>()(
  subscribeWithSelector((set, get) => ({
    config: DEFAULT_CONFIG,
    streams: new Map(),
    engines: new Map(),

    setConfig: (config: HLSConfig) => {
      set({ config: { ...get().config, ...config } });
    },

    loadStream: (streamId: string, videoElement: HTMLVideoElement) => {
      const { config, streams, engines } = get();

      // 이미 존재하는 스트림이면 먼저 정리
      const existingEngine = engines.get(streamId);
      if (existingEngine) {
        cleanupEngine(existingEngine);
      }

      // 새 스트림 상태 생성
      const newStreams = new Map(streams);
      newStreams.set(streamId, { ...createStreamState(streamId), status: 'loading' });

      const engine = createEngineInstance();
      engine.videoElement = videoElement;

      const newEngines = new Map(engines);
      newEngines.set(streamId, engine);

      set({ streams: newStreams, engines: newEngines });

      // 비디오 엘리먼트 설정
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true;

      // HLS 지원 확인 및 로드
      if (Hls.isSupported()) {
        loadHlsJs(streamId, videoElement, config, get, set);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        loadNativeHLS(streamId, videoElement, config, get, set);
      } else {
        updateStreamStatus(streamId, 'error', 'HLS is not supported in this browser', get, set);
      }
    },

    destroyStream: (streamId: string) => {
      const { streams, engines } = get();

      const engine = engines.get(streamId);
      if (engine) {
        cleanupEngine(engine);
      }

      const newStreams = new Map(streams);
      newStreams.delete(streamId);

      const newEngines = new Map(engines);
      newEngines.delete(streamId);

      set({ streams: newStreams, engines: newEngines });
    },

    destroyAll: () => {
      const { engines } = get();

      engines.forEach((engine) => {
        cleanupEngine(engine);
      });

      set({ streams: new Map(), engines: new Map() });
    },
  }))
);

function cleanupEngine(engine: HLSEngineInstance) {
  if (engine.statsInterval) {
    clearInterval(engine.statsInterval);
  }

  if (engine.reconnectTimer) {
    clearTimeout(engine.reconnectTimer);
  }

  if (engine.hls) {
    engine.hls.destroy();
  }

  if (engine.videoElement) {
    engine.videoElement.src = '';
    engine.videoElement.load();
  }
}

function updateStreamStatus(
  streamId: string,
  status: HLSStreamStatus,
  error: string | null,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const streams = new Map(get().streams);
  const stream = streams.get(streamId);
  if (stream) {
    streams.set(streamId, { ...stream, status, error });
    set({ streams });
  }
}

function updateStreamStats(
  streamId: string,
  stats: Partial<HLSStats>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const streams = new Map(get().streams);
  const stream = streams.get(streamId);
  if (stream) {
    streams.set(streamId, { ...stream, stats: { ...stream.stats, ...stats } });
    set({ streams });
  }
}

function loadHlsJs(
  streamId: string,
  videoElement: HTMLVideoElement,
  config: Required<HLSConfig>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const playlistUrl = `${config.serverUrl}/hls/${streamId}/index.m3u8`;

  const hls = new Hls({
    debug: false,
    enableWorker: true,
    // 저지연 모드
    lowLatencyMode: true,
    // 버퍼 설정 최적화 (다중 스트림용)
    backBufferLength: 30, // 뒤로 버퍼 (기본 90 → 30)
    maxBufferLength: 10, // 최대 버퍼 길이 (초)
    maxMaxBufferLength: 30, // 절대 최대 버퍼
    maxBufferSize: 30 * 1000 * 1000, // 30MB 버퍼 제한
    maxBufferHole: 0.5, // 버퍼 갭 허용치
    // 라이브 스트리밍 최적화
    liveSyncDuration: 3, // 라이브 동기화 지점
    liveMaxLatencyDuration: 10, // 최대 지연 허용
    liveDurationInfinity: true, // 라이브 스트림 무한 재생
    // 로딩 최적화
    manifestLoadingTimeOut: 10000, // 매니페스트 타임아웃
    manifestLoadingMaxRetry: 3,
    levelLoadingTimeOut: 10000,
    fragLoadingTimeOut: 20000,
  });

  // 엔진 인스턴스 업데이트
  const engines = new Map(get().engines);
  const engine = engines.get(streamId);
  if (engine) {
    engine.hls = hls;
    set({ engines });
  }

  // HLS 이벤트 핸들러
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    updateStreamStatus(streamId, 'playing', null, get, set);

    // 엔진 reconnectAttempts 리셋
    const engines = new Map(get().engines);
    const engine = engines.get(streamId);
    if (engine) {
      engine.reconnectAttempts = 0;
      set({ engines });
    }

    startStatsCollection(streamId, videoElement, get, set);

    videoElement.play().catch(() => {
      // autoplay 차단될 수 있음
    });
  });

  hls.on(Hls.Events.FRAG_LOADED, (_event: string, data: FragLoadedData) => {
    const streams = new Map(get().streams);
    const stream = streams.get(streamId);
    if (stream) {
      const newBytesLoaded = stream.stats.bytesLoaded + data.frag.stats.total;
      streams.set(streamId, {
        ...stream,
        stats: { ...stream.stats, bytesLoaded: newBytesLoaded },
      });
      set({ streams });
    }
  });

  hls.on(Hls.Events.ERROR, (_event: string, data: ErrorData) => {
    handleHlsError(streamId, data, config, get, set);
  });

  // 비디오 이벤트
  const handlePlaying = () => updateStreamStatus(streamId, 'playing', null, get, set);
  const handleWaiting = () => updateStreamStatus(streamId, 'buffering', null, get, set);
  const handleCanPlay = () => {
    const stream = get().streams.get(streamId);
    if (stream?.status === 'buffering') {
      updateStreamStatus(streamId, 'playing', null, get, set);
    }
  };

  videoElement.addEventListener('playing', handlePlaying);
  videoElement.addEventListener('waiting', handleWaiting);
  videoElement.addEventListener('canplay', handleCanPlay);

  // 플레이리스트 로드
  hls.loadSource(playlistUrl);
  hls.attachMedia(videoElement);
}

function loadNativeHLS(
  streamId: string,
  videoElement: HTMLVideoElement,
  config: Required<HLSConfig>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const playlistUrl = `${config.serverUrl}/hls/${streamId}/index.m3u8`;

  videoElement.src = playlistUrl;

  const handleLoadedMetadata = () => {
    updateStreamStatus(streamId, 'playing', null, get, set);

    const engines = new Map(get().engines);
    const engine = engines.get(streamId);
    if (engine) {
      engine.reconnectAttempts = 0;
      set({ engines });
    }

    startStatsCollection(streamId, videoElement, get, set);
  };

  const handlePlaying = () => updateStreamStatus(streamId, 'playing', null, get, set);
  const handleWaiting = () => updateStreamStatus(streamId, 'buffering', null, get, set);
  const handleCanPlay = () => {
    const stream = get().streams.get(streamId);
    if (stream?.status === 'buffering') {
      updateStreamStatus(streamId, 'playing', null, get, set);
    }
  };
  const handleError = () => {
    handleNativeError(streamId, config, get, set);
  };

  videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  videoElement.addEventListener('playing', handlePlaying);
  videoElement.addEventListener('waiting', handleWaiting);
  videoElement.addEventListener('canplay', handleCanPlay);
  videoElement.addEventListener('error', handleError);
}

function handleHlsError(
  streamId: string,
  data: ErrorData,
  config: Required<HLSConfig>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const engines = get().engines;
  const engine = engines.get(streamId);

  if (!engine?.hls) return;

  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        engine.hls.startLoad();
        break;

      case Hls.ErrorTypes.MEDIA_ERROR:
        engine.hls.recoverMediaError();
        break;

      default:
        updateStreamStatus(streamId, 'error', `HLS Error: ${data.details}`, get, set);
        cleanupEngine(engine);

        if (config.autoReconnect) {
          scheduleReconnect(streamId, config, get, set);
        }
        break;
    }
  }
}

function handleNativeError(
  streamId: string,
  config: Required<HLSConfig>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  updateStreamStatus(streamId, 'error', 'Native HLS error', get, set);

  if (config.autoReconnect) {
    scheduleReconnect(streamId, config, get, set);
  }
}

function scheduleReconnect(
  streamId: string,
  config: Required<HLSConfig>,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const engines = new Map(get().engines);
  const engine = engines.get(streamId);

  if (!engine) return;

  if (engine.reconnectAttempts >= config.maxReconnectAttempts) {
    updateStreamStatus(
      streamId,
      'error',
      `Max reconnect attempts (${config.maxReconnectAttempts}) reached`,
      get,
      set
    );
    return;
  }

  engine.reconnectAttempts++;
  set({ engines });

  engine.reconnectTimer = setTimeout(() => {
    const currentEngine = get().engines.get(streamId);
    if (currentEngine?.videoElement) {
      get().loadStream(streamId, currentEngine.videoElement);
    }
  }, config.reconnectDelay);
}

function startStatsCollection(
  streamId: string,
  videoElement: HTMLVideoElement,
  get: () => HLSStore,
  set: (partial: Partial<HLSState>) => void
) {
  const engines = new Map(get().engines);
  const engine = engines.get(streamId);

  if (!engine) return;

  if (engine.statsInterval) {
    clearInterval(engine.statsInterval);
  }

  engine.statsInterval = setInterval(() => {
    const stream = get().streams.get(streamId);
    if (!stream) return;

    // 비트레이트 계산
    const currentEngine = get().engines.get(streamId);
    if (!currentEngine) return;

    const bytesDelta = stream.stats.bytesLoaded - currentEngine.lastBytesLoaded;
    const bitrate = (bytesDelta * 8) / 1000; // kbps
    currentEngine.lastBytesLoaded = stream.stats.bytesLoaded;

    // 버퍼 길이 계산
    let bufferLength = 0;
    if (videoElement.buffered.length > 0) {
      const currentTime = videoElement.currentTime;
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      bufferLength = bufferedEnd - currentTime;
    }

    // Dropped frames (WebKit only)
    const droppedFrames =
      (videoElement as HTMLVideoElement & { webkitDroppedFrameCount?: number })
        .webkitDroppedFrameCount || 0;

    updateStreamStats(streamId, { bitrate, bufferLength, droppedFrames }, get, set);
  }, 1000);

  set({ engines });
}
