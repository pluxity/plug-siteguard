import type { CCTVListResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_MEDIA_API_URL || 'http://192.168.10.181:9997';

export const cctvApi = {
  async fetchCCTVList(): Promise<CCTVListResponse> {
    const response = await fetch(`${API_BASE_URL}/v3/paths/list`);

    if (!response.ok) {
      throw new Error(`Failed to fetch CCTV list: ${response.statusText}`);
    }

    const data: CCTVListResponse = await response.json();
    return data;
  },
};
