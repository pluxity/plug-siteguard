import { api } from './api';
import type {
  Stream,
  StreamsResponse,
  ProgressDataPoint,
  ProgressPeriod,
  ProgressResponse,
  StatisticsResponse,
  StatisticsRequest,
} from './types/sample';

export async function getStreams(): Promise<Stream[]> {
  const response = await api.get<StreamsResponse>('sample/streams.json');
  return response.items;
}

export async function getActiveStreams(): Promise<Stream[]> {
  const response = await api.get<StreamsResponse>('sample/streams.json');
  return response.items.filter((stream) => stream.ready);
}

export async function getAllStreams(): Promise<StreamsResponse> {
  return api.get<StreamsResponse>('sample/streams.json');
}

export async function getProgressData(period: ProgressPeriod): Promise<ProgressDataPoint[]> {
  const response = await api.get<ProgressResponse>('sample/sample_data.json');
  return response[period];
}

export async function getAllProgressData(): Promise<ProgressResponse> {
  return api.get<ProgressResponse>('sample/sample_data.json');
}

export async function getStatisticsData(params: StatisticsRequest): Promise<StatisticsResponse> {
  return api.get<StatisticsResponse>(`/sample/statistics/statistics_${params.page}.json`, { params });
}