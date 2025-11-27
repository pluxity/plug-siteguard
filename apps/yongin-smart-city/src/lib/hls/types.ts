export type HLSStreamStatus = 'idle' | 'loading' | 'playing' | 'error' | 'buffering';

export interface HLSStats {
  bytesLoaded: number;
  bitrate: number;
  bufferLength: number;
  droppedFrames: number;
}

export interface HLSStreamState {
  streamId: string;
  status: HLSStreamStatus;
  error: string | null;
  stats: HLSStats;
}

export interface HLSConfig {
  serverUrl?: string;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}
