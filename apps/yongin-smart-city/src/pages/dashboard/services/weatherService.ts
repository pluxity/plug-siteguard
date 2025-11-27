import type { WeatherData, WeatherLocation } from '../types/weather';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const parseWeatherLocation = (location: string): WeatherLocation => {
  const coordMatch = location.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lon: parseFloat(coordMatch[2]),
    };
  }

  return { cityName: location };
};

export const getWeather = async (
  location: WeatherLocation
): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'undefined') {
    throw new Error('OpenWeather API 키가 설정되지 않았습니다.');
  }

  let url: string;

  // 좌표인 경우
  if ('lat' in location) {
    url = `${OPENWEATHER_BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
  } 
  // 도시 이름인 경우
  else {
    const query = location.countryCode ? `${location.cityName},${location.countryCode}` : location.cityName;
    url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`날씨 정보를 가져오는데 실패했습니다. (${response.status})`);
  }
  
  return response.json();
};

