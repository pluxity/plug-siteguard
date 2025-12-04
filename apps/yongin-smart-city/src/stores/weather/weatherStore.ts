import { create } from 'zustand';
import { getWeather, parseWeatherLocation } from '@/services';
import type { WeatherData } from '@/services';

interface WeatherStore {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: () => Promise<void>;
  startWeatherUpdates: () => () => void;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchWeather: async () => {
    set({ loading: true, error: null });

    try {
      const weatherCity = import.meta.env.VITE_WEATHER_CITY;

      if (!weatherCity) {
        throw new Error('날씨 도시 정보가 설정되지 않았습니다.');
      }

      const location = parseWeatherLocation(weatherCity);

      const weatherData =
        'lat' in location && 'lon' in location
          ? await getWeather(location)
          : await getWeather({ cityName: location.cityName, countryCode: location.countryCode });

      set({ data: weatherData, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '날씨 정보를 불러올 수 없습니다.',
        loading: false,
      });
    }
  },

  startWeatherUpdates: () => {
    const { fetchWeather } = get();
    const updateInterval = parseInt(import.meta.env.VITE_WEATHER_UPDATE_INTERVAL || '600000', 10);
    const intervalId = setInterval(fetchWeather, updateInterval);

    return () => clearInterval(intervalId);
  },
}));
