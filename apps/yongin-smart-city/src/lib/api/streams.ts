export interface RuntimeInfo {
  is_active: boolean;
  codec: string;
  resolution: string;
  fps: number;
  bitrate: string;
  connection_count: number;
  uptime: number;
  last_keyframe: number;
}

export interface StreamInfo {
  id: string;
  name: string;
  source: string;
  rtsp_transport: string;
  source_on_demand: boolean;
  runtime_info: RuntimeInfo;
  created_at: string;
  updated_at: string;
}

export interface StreamsResponse {
  count: number;
  streams: StreamInfo[];
}

export async function getStreams(): Promise<StreamInfo[]> {
  const response = await fetch('/sample/streams.json');
  const data: StreamsResponse = await response.json();
  return data.streams.filter((stream) => stream.runtime_info.is_active);
}
