import { createApiClient } from '@plug-siteguard/api';

const baseURL = typeof window !== 'undefined'
  ? window.location.origin + import.meta.env.BASE_URL
  : import.meta.env.BASE_URL;

export const api = createApiClient({
  baseURL,
});
