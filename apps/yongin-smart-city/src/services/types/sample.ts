export interface StreamSource {
  type: string;
  id: string;
}

export interface StreamReader {
  type: string;
  id: string;
}

export interface Stream {
  name: string;
  confName: string;
  source: StreamSource;
  ready: boolean;
  readyTime: string | null;
  tracks: string[];
  bytesReceived: number;
  bytesSent: number;
  readers: StreamReader[];
}

export interface StreamsResponse {
  itemCount: number;
  pageCount: number;
  items: Stream[];
}

export interface ProgressDataPoint {
  date: string;
  planned: number;
  current: number;
}

export type ProgressPeriod = 'MONTH-6' | 'MONTH-12' | 'ALL';

export interface ProgressResponse {
  'MONTH-6': ProgressDataPoint[];
  'MONTH-12': ProgressDataPoint[];
  ALL: ProgressDataPoint[];
}
