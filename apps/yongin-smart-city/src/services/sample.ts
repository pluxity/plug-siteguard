import { api } from './api';
import type {
  Stream,
  StreamsResponse,
  ProgressDataPoint,
  ProgressPeriod,
  ProgressResponse,
} from './types/sample';

export async function getStreams(): Promise<Stream[]> {
  const response = await api.get<StreamsResponse>('/sample/streams.json');
  return response.streams.filter((stream) => stream.runtime_info.is_active);
}

export async function getAllStreams(): Promise<StreamsResponse> {
  return api.get<StreamsResponse>('/sample/streams.json');
}

export async function getProgressData(period: ProgressPeriod): Promise<ProgressDataPoint[]> {
  const response = await api.get<ProgressResponse>('/sample/sample_data.json');
  return response[period];
}

export async function getAllProgressData(): Promise<ProgressResponse> {
  return api.get<ProgressResponse>('/sample/sample_data.json');
}
