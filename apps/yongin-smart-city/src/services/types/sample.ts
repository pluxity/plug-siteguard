export interface StreamRuntimeInfo {
  is_active: boolean;
  codec: string;
  bytes_received: number;
  bytes_sent: number;
  packets_received: number;
  packets_sent: number;
  subscriber_count: number;
}

export interface Stream {
  id: string;
  name: string;
  source: string;
  rtsp_transport: string;
  source_on_demand: boolean;
  runtime_info: StreamRuntimeInfo;
  created_at: string;
  updated_at: string;
}

export interface StreamsResponse {
  count: number;
  streams: Stream[];
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
