import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { buildWhepUrl, performWhepNegotiation } from './client';
import type { CCTVInfo } from './types';

const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;

const WHEP_URL = import.meta.env.VITE_WHEP_URL;
const CCTV_API_URL = import.meta.env.VITE_CCTV_API_URL;

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export type WHEPStreamStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export interface WHEPStreamState {
  streamId: string;
  status: WHEPStreamStatus;
  pc: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  error: string | null;
  retryCount: number;
  retryTimer: ReturnType<typeof setTimeout> | null;
  abortController: AbortController | null;
}

interface WHEPState {
  initialized: boolean;
  cctvList: CCTVInfo[];
  cctvLoading: boolean;
  streams: Map<string, WHEPStreamState>;
}

interface WHEPActions {
  initialize: () => Promise<void>;
  cleanup: () => void;
  fetchCCTVList: () => Promise<void>;
  connectStream: (streamId: string) => Promise<void>;
  disconnectStream: (streamId: string) => void;
}

type WHEPStore = WHEPState & WHEPActions;

const createStreamState = (streamId: string): WHEPStreamState => ({
  streamId,
  status: 'idle',
  pc: null,
  remoteStream: null,
  error: null,
  retryCount: 0,
  retryTimer: null,
  abortController: null,
});

function cleanupStreamState(stream: WHEPStreamState) {
  if (stream.retryTimer) {
    clearTimeout(stream.retryTimer);
  }
  if (stream.abortController) {
    stream.abortController.abort();
  }
  if (stream.pc) {
    stream.pc.close();
  }
  if (stream.remoteStream) {
    stream.remoteStream.getTracks().forEach((t) => t.stop());
  }
}

export const useWHEPStore = create<WHEPStore>()(
  subscribeWithSelector((set, get) => ({
    initialized: false,
    cctvList: [],
    cctvLoading: false,
    streams: new Map(),

    initialize: async () => {
      await get().fetchCCTVList();
      set({ initialized: true });
    },

    cleanup: () => {
      const { streams } = get();

      streams.forEach((stream) => {
        cleanupStreamState(stream);
      });

      set({
        initialized: false,
        streams: new Map(),
      });
    },

    fetchCCTVList: async () => {
      set({ cctvLoading: true });

      try {
        const res = await fetch(CCTV_API_URL);
        const data = await res.json();

        const list: CCTVInfo[] = data.items.map((s: { name: string }) => ({
          id: s.name,
          name: s.name,
        }));

        set({ cctvList: list, cctvLoading: false });
      } catch {
        set({ cctvLoading: false });
      }
    },

    connectStream: async (streamId: string) => {
      const { streams } = get();

      const existing = streams.get(streamId);

      // 이미 연결 중이거나 연결된 경우 스킵
      if (existing && (existing.status === 'connected' || existing.status === 'connecting')) {
        return;
      }

      // 기존 연결 정리 (failed 상태에서 재시도할 때만)
      if (existing) {
        if (existing.pc) {
          existing.pc.close();
        }
        if (existing.abortController) {
          existing.abortController.abort();
        }
      }

      const retryCount = existing?.retryCount ?? 0;
      const abortController = new AbortController();

      const newStreams = new Map(streams);
      newStreams.set(streamId, {
        ...createStreamState(streamId),
        status: 'connecting',
        retryCount,
        abortController,
      });
      set({ streams: newStreams });

      // PeerConnection 생성
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // PC 업데이트
      set((state) => {
        const s = new Map(state.streams);
        const st = s.get(streamId);
        if (st) s.set(streamId, { ...st, pc });
        return { streams: s };
      });

      // 트랙 수신 핸들러
      pc.ontrack = (e) => {
        if (e.streams[0]) {
          set((s) => {
            const streams = new Map(s.streams);
            const st = streams.get(streamId);
            if (st) {
              streams.set(streamId, { ...st, remoteStream: e.streams[0] });
            }
            return { streams };
          });
        }
      };

      // 연결 상태 변화 핸들러
      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;

        if (state === 'connected') {
          set((s) => {
            const streams = new Map(s.streams);
            const st = streams.get(streamId);
            if (st) {
              streams.set(streamId, { ...st, status: 'connected', retryCount: 0 });
            }
            return { streams };
          });
        } else if (state === 'failed' || state === 'disconnected') {
          scheduleRetry(streamId, get, set);
        }
      };

      // Transceiver 추가
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      try {
        const url = buildWhepUrl(WHEP_URL, streamId);
        await performWhepNegotiation(pc, url, abortController.signal);
      } catch (err) {
        if (abortController.signal.aborted) return;
        scheduleRetry(streamId, get, set);
      }
    },

    disconnectStream: (streamId: string) => {
      const { streams } = get();
      const stream = streams.get(streamId);

      if (!stream) return;

      cleanupStreamState(stream);

      const newStreams = new Map(streams);
      newStreams.delete(streamId);
      set({ streams: newStreams });
    },
  }))
);

function scheduleRetry(
  streamId: string,
  get: () => WHEPStore,
  set: (partial: Partial<WHEPState>) => void
) {
  const streams = new Map(get().streams);
  const stream = streams.get(streamId);

  if (!stream) return;

  const newRetryCount = stream.retryCount + 1;

  if (newRetryCount > MAX_RETRIES) {
    streams.set(streamId, {
      ...stream,
      status: 'failed',
      error: 'Max retries exceeded',
    });
    set({ streams });
    return;
  }

  const retryTimer = setTimeout(() => {
    get().connectStream(streamId);
  }, RETRY_DELAY);

  streams.set(streamId, {
    ...stream,
    status: 'connecting',
    retryCount: newRetryCount,
    retryTimer,
  });
  set({ streams });
}
