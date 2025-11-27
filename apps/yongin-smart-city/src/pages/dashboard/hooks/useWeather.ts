import { useState, useEffect } from 'react';
import { getWeather, parseWeatherLocation } from '../services/weatherService';
import type { WeatherData } from '../types/weather';

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setError(null);
        
        const weatherCity = import.meta.env.VITE_WEATHER_CITY;

        if (!weatherCity) {
          throw new Error('날씨 도시 정보가 설정되지 않았습니다.');
        }
        const location = parseWeatherLocation(weatherCity);
        
        const weatherData = 'lat' in location && 'lon' in location
          ? await getWeather(location)
          : await getWeather({ cityName: location.cityName, countryCode: location.countryCode });
        
        setData(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '날씨 정보를 불러올 수 없습니다.');
      }
    };

    const initialFetch = async () => {
      setLoading(true);
      await fetchWeather();
      setLoading(false);
    };

    initialFetch();
    
    const updateInterval = parseInt(import.meta.env.VITE_WEATHER_UPDATE_INTERVAL || '600000', 10);
    const interval = setInterval(fetchWeather, updateInterval);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};

