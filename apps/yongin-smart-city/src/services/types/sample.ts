import { PageResponse } from "@plug-siteguard/api";
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

export interface Statistics {
  id: number;
  event_id: string;
  type: string;
  category: string;
  location: string;
  progress: string;
  status: string;
  severity: string;
  occurredAt: string;
  resolvedAt: string | null;
  description: string;
}

export interface StatisticsRequest
  extends Record<string, string | number | boolean | undefined> {
  page: number;
  size: number;

  location?: string;
  progress?: string;
  status?: string;
  severity?: string;
  keyword?: string;

  from?: string;
  to?: string;
}

export type StatisticsResponse = PageResponse<Statistics>;

export interface Events {
  id: number;
  eventId: string;
  eventNm: string;
  location: string;
  deviceNm: string;
  status: string;
  progress: string;
  occurredAt: string;
  resolvedAt: string;
}

export interface EventsRequest
  extends Record<string, string | number | boolean | undefined> {
  page: number;
  size: number;

  location?: string;
  progress?: string;
  status?: string;
  keyword?: string;

  from?: string;
  to?: string;
}

export type EventsResponse = PageResponse<Events>;

export interface FilterOption {
  id: number;
  name: string;
  description?: string;
}

export interface FilterDataWithMeta {
  data: FilterOption[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface BaseDataResponse {
  site: FilterDataWithMeta;
  progress: FilterDataWithMeta;
  severity: FilterDataWithMeta;
  status: FilterDataWithMeta;
}