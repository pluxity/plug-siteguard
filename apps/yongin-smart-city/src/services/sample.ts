import { api } from './api';
import type {
  Stream,
  StreamsResponse,
  ProgressDataPoint,
  ProgressPeriod,
  ProgressResponse,
  StatisticsResponse,
  StatisticsRequest,
  BaseDataResponse,
  FilterOption,
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
  return api.get<StatisticsResponse>(`sample/statistics_${params.page}.json`, { params });
}

export async function getBaseData(): Promise<BaseDataResponse> {
  return api.get<BaseDataResponse>('sample/base.json');
}

export async function getSiteOptions(): Promise<FilterOption[]> {
  const response = await api.get<BaseDataResponse>('sample/base.json');
  return response.site.data;
}

export async function getProgressOptions(): Promise<FilterOption[]> {
  const response = await api.get<BaseDataResponse>('sample/base.json');
  return response.progress.data;
}

export async function getSeverityOptions(): Promise<FilterOption[]> {
  const response = await api.get<BaseDataResponse>('sample/base.json');
  return response.severity.data;
}

export async function getStatusOptions(): Promise<FilterOption[]> {
  const response = await api.get<BaseDataResponse>('sample/base.json');
  return response.status.data;
}