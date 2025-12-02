import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { WebSocketMessage } from './types';

const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;

export interface CCTVInfo {
  id: string;
  name: string;
  source: string;
}

export type StreamStatus = 'idle' | 'connecting' | 'connected' | 'failed';

export interface StreamState {
  streamId: string;
  status: StreamStatus;
  pc: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  iceCandidates: RTCIceCandidateInit[];
  error: string | null;
  retryCount: number;
  retryTimer: ReturnType<typeof setTimeout> | null;
}

interface WebRTCState {
  initialized: boolean;
  ws: WebSocket | null;
  wsConnected: boolean;
  cctvList: CCTVInfo[];
  cctvLoading: boolean;
  streams: Map<string, StreamState>;
}

interface WebRTCActions {
  initialize: () => Promise<void>;
  cleanup: () => void;
  fetchCCTVList: () => Promise<void>;
  connectStream: (streamId: string) => Promise<void>;
  disconnectStream: (streamId: string) => void;
  send: (type: string, streamId: string, payload?: unknown) => void;
}

type WebRTCStore = WebRTCState & WebRTCActions;

const WS_URL = import.meta.env.VITE_WS_URL;
const CCTV_API_URL = import.meta.env.VITE_CCTV_API_URL;

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const createStreamState = (streamId: string): StreamState => ({
  streamId,
  status: 'idle',
  pc: null,
  remoteStream: null,
  iceCandidates: [],
  error: null,
  retryCount: 0,
  retryTimer: null,
});

function cleanupStreamState(stream: StreamState) {
  if (stream.retryTimer) {
    clearTimeout(stream.retryTimer);
  }
  if (stream.pc) {
    stream.pc.close();
  }
  if (stream.remoteStream) {
    stream.remoteStream.getTracks().forEach((t) => t.stop());
  }
}

export const useWebRTCStore = create<WebRTCStore>()(
  subscribeWithSelector((set, get) => ({
    initialized: false,
    ws: null,
    wsConnected: false,
    cctvList: [],
    cctvLoading: false,
    streams: new Map(),

    initialize: async () => {
      await new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(WS_URL);

        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

        ws.onopen = () => {
          clearTimeout(timeout);
          set({ ws, wsConnected: true });
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            handleMessage(message, get, set);
          } catch {
            // ignore parse errors
          }
        };

        ws.onerror = (err) => {
          clearTimeout(timeout);
          reject(err);
        };

        ws.onclose = () => {
          set({ wsConnected: false, ws: null });
        };

        set({ ws });
      });

      await get().fetchCCTVList();
      set({ initialized: true });
    },

    cleanup: () => {
      const { streams, ws } = get();

      streams.forEach((stream) => {
        cleanupStreamState(stream);
      });

      if (ws) ws.close();

      set({
        initialized: false,
        ws: null,
        wsConnected: false,
        streams: new Map(),
      });
    },

    fetchCCTVList: async () => {
      set({ cctvLoading: true });

      try {
        const res = await fetch(CCTV_API_URL);
        const data = await res.json();

        const list: CCTVInfo[] = data.streams
          .filter((s: { runtime_info?: { is_active?: boolean } }) => s.runtime_info?.is_active)
          .map((s: { id: string; name: string; source: string }) => ({
            id: s.id,
            name: s.name,
            source: s.source,
          }));

        set({ cctvList: list, cctvLoading: false });
      } catch {
        set({ cctvLoading: false });
      }
    },

    connectStream: async (streamId: string) => {
      const { streams, wsConnected, ws } = get();

      const existing = streams.get(streamId);
      if (existing && existing.status === 'connected') {
        return;
      }

      if (!wsConnected || !ws) {
        return;
      }

      // 기존 연결 정리 (재시도 타이머는 유지)
      if (existing?.pc) {
        existing.pc.close();
      }

      const retryCount = existing?.retryCount ?? 0;
      const newStreams = new Map(streams);
      newStreams.set(streamId, {
        ...createStreamState(streamId),
        status: 'connecting',
        retryCount,
      });
      set({ streams: newStreams });

      const pc = new RTCPeerConnection(ICE_SERVERS);

      set((state) => {
        const s = new Map(state.streams);
        const st = s.get(streamId);
        if (st) s.set(streamId, { ...st, pc });
        return { streams: s };
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          try {
            get().send('ice', streamId, e.candidate);
          } catch {
            // ignore send errors
          }
        }
      };

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

      pc.ontrack = (e) => {
        if (e.streams[0]) {
          set((s) => {
            const streams = new Map(s.streams);
            const st = streams.get(streamId);
            if (st) streams.set(streamId, { ...st, remoteStream: e.streams[0] });
            return { streams };
          });
        }
      };

      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      try {
        const offer = await pc.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(offer);

        get().send('offer', streamId, { sdp: offer.sdp, streamId });
      } catch {
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

    send: (type: string, streamId: string, payload?: unknown) => {
      const { ws, wsConnected } = get();
      if (!ws || !wsConnected) {
        throw new Error('WebSocket not connected');
      }

      const msg: WebSocketMessage = { type, streamId, payload };
      ws.send(JSON.stringify(msg));
    },
  }))
);

function scheduleRetry(
  streamId: string,
  get: () => WebRTCStore,
  set: (partial: Partial<WebRTCState>) => void
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

function handleMessage(
  message: WebSocketMessage,
  get: () => WebRTCStore,
  set: (partial: Partial<WebRTCState>) => void
) {
  const { type, streamId, payload } = message;

  if (!streamId) return;

  const stream = get().streams.get(streamId);
  if (!stream) return;

  switch (type) {
    case 'answer':
      handleAnswer(streamId, payload as string, get, set);
      break;
    case 'ice':
      handleIce(streamId, payload as RTCIceCandidateInit, get, set);
      break;
    case 'error':
      scheduleRetry(streamId, get, set);
      break;
  }
}

async function handleAnswer(
  streamId: string,
  sdp: string,
  get: () => WebRTCStore,
  set: (partial: Partial<WebRTCState>) => void
) {
  const stream = get().streams.get(streamId);
  const pc = stream?.pc;

  if (!pc) return;
  if (pc.signalingState !== 'have-local-offer') return;

  try {
    await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));

    const currentStream = get().streams.get(streamId);
    if (currentStream && currentStream.iceCandidates.length > 0) {
      for (const candidate of currentStream.iceCandidates) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }

      set({
        streams: new Map(get().streams).set(streamId, {
          ...currentStream,
          iceCandidates: [],
        }),
      });
    }
  } catch {
    // ignore errors
  }
}

async function handleIce(
  streamId: string,
  candidate: RTCIceCandidateInit,
  get: () => WebRTCStore,
  set: (partial: Partial<WebRTCState>) => void
) {
  const stream = get().streams.get(streamId);
  const pc = stream?.pc;

  if (!pc || !stream) return;

  if (!pc.remoteDescription) {
    set({
      streams: new Map(get().streams).set(streamId, {
        ...stream,
        iceCandidates: [...stream.iceCandidates, candidate],
      }),
    });
    return;
  }

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  } catch {
    // ignore errors
  }
}
