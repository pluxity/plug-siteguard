import { useState, useEffect } from 'react';
import { 
  formatDate, 
  getWindDirection,
  getWeatherIconName,
  getWeather,
  type WeatherData
} from '../../../lib/api/weather';
import { MapPin } from 'lucide-react';

export default function Weather() {
  // 용인시 기흥구 좌표
  const lat = 37.2411;
  const lon = 127.1776;
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await getWeather(lat, lon);
        setData(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '날씨 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col rounded-lg">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">날씨 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full min-h-[400px] flex flex-col rounded-lg">
        <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
          <div className="text-red-500 font-medium">날씨 정보를 불러올 수 없습니다.</div>
          {error && (
            <div className="text-sm text-gray-600 text-center max-w-md">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(data.main.temp * 10) / 10;
  const minTemp = Math.round(data.main.temp_min);
  const maxTemp = Math.round(data.main.temp_max);
  const weatherIcon = getWeatherIconName(data.weather[0]?.icon || '01d');
  const weatherDescription = data.weather[0]?.description || '';
  const windDirection = getWindDirection(data.wind.deg);
  const windSpeed = data.wind.speed.toFixed(1);

  return (
    <div className="h-full min-h-[400px] flex flex-col justify-between rounded-lg">
      {/* 날씨 정보 헤더 섹션 */}
      <div className="flex items-center gap-4 bg-white rounded-lg">

        {/* 날씨 아이콘 (보라색 테두리) */}
        <div className="bg-[#dcedfc] rounded p-2">
          <img 
            src={`/assets/icons/${weatherIcon}.svg`}
            alt={weatherDescription}
            className="w-12 h-12"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://openweathermap.org/img/wn/${data.weather[0]?.icon || '01d'}@2x.png`;
            }}
          />
        </div>

        {/* 우측 정보 영역 */}
        <div className="flex-1 flex flex-col gap-2">
          {/* 위치 및 날짜 정보 (위) */}
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">{data.name} 기흥구</span>
            <span className="text-gray-500"> | </span>
            <span className="text-gray-500">{formatDate(data.dt)}</span>
          </div>

          {/* 온도, 날씨 상태, 최저/최고 온도 및 풍향 정보 (한 줄) */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-lg font-bold">{currentTemp}°</span>
            <span className="text-lg font-bold">{weatherDescription}</span>
            <span className="text-sm text-gray-600">최저 <span className="text-gray-800">{minTemp}°</span> | 최고 <span className="text-gray-800">{maxTemp}°</span></span>
            <span className="text-sm text-gray-800">{windDirection} {windSpeed} m/s</span>
          </div>
        </div>
      </div>

      {/* 대기질 정보 (별도 섹션) */}
      <div className="bg-zinc-100 rounded-lg w-full min-h-16 mt-2 mb-4 flex items-center justify-between px-5">
        <div className="flex flex-col gap-1">
          <div className="text-zinc-500 text-xs font-bold">대기질</div>
          <div className="inline-flex justify-start items-end gap-0.5">
            <div className="text-sky-500 text-base font-bold leading-4">1.0</div>
            <div className="text-neutral-400 text-xs font-normal">보통</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-zinc-500 text-xs font-bold">이산화질소</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-lime-600 text-base font-bold leading-4">0.052</div>
            <div className="text-neutral-400 text-xs font-normal">매우좋음</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-zinc-500 text-xs font-bold">미세먼지</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-amber-500 text-base font-bold leading-4">54</div>
            <div className="text-neutral-400 text-xs font-normal">나쁨</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-zinc-500 text-xs font-bold">초미세먼지</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-red-500 text-base font-bold leading-4">100</div>
            <div className="text-neutral-400 text-xs font-normal">매우나쁨</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-zinc-500 text-xs font-bold">현장 환경 지수</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-lime-600 text-base font-bold leading-4">80</div>
            <div className="text-neutral-400 text-xs font-normal">매우 좋음</div>
          </div>
        </div>
      </div>



      <div className="flex justify-between gap-4">
        <img
          src="/assets/images/weather-danger.png"
          alt="위험 날씨 알림"
        />
        <img
          src="/assets/images/weather-notice.png"
          alt="주의 날씨 알림"
        />
        <img
          src="/assets/images/weather-warning.png"
          alt="경고 날씨 알림"
        />
      </div>
    </div>
  );
}
