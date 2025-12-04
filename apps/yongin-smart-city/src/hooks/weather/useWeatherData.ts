import { useWeatherStore } from '../../stores/weather/weatherStore';
import { getWeatherIconName, getWeatherDescription, getWindDirection } from '@/services';

export const useWeatherData = () => {
  const { data, loading, error } = useWeatherStore();

  if (!data) {
    return { data: null, loading, error };
  }

  return {
    loading,
    error,
    data: {
      raw: data,
      cityName: data.name,
      currentTemp: Math.round(data.main.temp * 10) / 10,
      minTemp: Math.round(data.main.temp_min),
      maxTemp: Math.round(data.main.temp_max),
      weatherIcon: getWeatherIconName(data.weather[0]?.id || 800),
      humidity: data.main.humidity,
      weatherDescription: getWeatherDescription(data.weather[0]?.id || 800, data.weather[0]?.description || ''),
      windDirection: getWindDirection(data.wind.deg || 0),
      windSpeed: data.wind.speed.toFixed(1),
    }
  };
};