/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL: string;
  readonly VITE_HLS_URL: string;
  readonly VITE_WHEP_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_CESIUM_ION_ACCESS_TOKEN: string;
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_WEATHER_CITY?: string;
  readonly VITE_WEATHER_UPDATE_INTERVAL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
