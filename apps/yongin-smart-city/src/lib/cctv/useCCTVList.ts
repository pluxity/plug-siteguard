import { useEffect, useState } from 'react';
import { cctvApi } from './api';
import type { CCTVStream } from './types';

interface UseCCTVListReturn {
  streams: CCTVStream[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCCTVList(): UseCCTVListReturn {
  const [streams, setStreams] = useState<CCTVStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStreams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await cctvApi.fetchCCTVList();
      setStreams(data.items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch CCTV list'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  return {
    streams,
    isLoading,
    error,
    refetch: fetchStreams,
  };
}
