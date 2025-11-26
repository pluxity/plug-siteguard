const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  sys: {
    country: string;
  };
}

export const getWindDirection = (deg: number): string => {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  const index = Math.round(deg / 45) % 8;
  return `${directions[index]}풍`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${year}-${month}-${day}(${weekday})`;
};

export const getWeatherIconName = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': 'sunny',
    '01n': 'sunny',
    '02d': 'partly-cloudy',
    '02n': 'partly-cloudy',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'rainy',
    '09n': 'rainy',
    '10d': 'rainy',
    '10n': 'rainy',
    '11d': 'thunderstorm-rain',
    '11n': 'thunderstorm-rain',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist',
  };
  
  return iconMap[iconCode] || 'sunny';
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'undefined') {
    throw new Error('OpenWeather API 키가 설정되지 않았습니다.');
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('OpenWeather API 키가 유효하지 않습니다.');
    }
    throw new Error(`날씨 정보를 가져오는데 실패했습니다. (${response.status})`);
  }
  
  return response.json();
};

