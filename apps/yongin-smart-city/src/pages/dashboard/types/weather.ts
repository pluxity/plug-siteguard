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

export type WeatherLocation = { lat: number; lon: number } | { cityName: string; countryCode?: string };

