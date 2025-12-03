import { useWeatherData } from '@/hooks/weather/useWeatherData';
import { 
  formatDate, 
} from '@/services';
import { MapPin } from 'lucide-react';

export default function Weather() {
  const { data, loading, error } = useWeatherData();

  return (
    <div className="h-full min-h-[400px] flex flex-col justify-between rounded-lg">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">날씨 정보를 불러오는 중...</div>
        </div>
      ) : error || !data ? (
        <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
        <div className="text-red-500 font-medium">날씨 정보를 불러올 수 없습니다.</div>
        {error && (
          <div className="text-sm text-gray-600 text-center max-w-md">
            {error}
          </div>
        )}
      </div>
      ) : (
        <>
          <div className="flex items-center gap-4 bg-white rounded-lg">
            <div className="bg-[#dcedfc] rounded p-2">
              <img
                src={`${import.meta.env.BASE_URL}assets/icons/${data.weatherIcon}.svg`}
                alt={data.weatherDescription}
                className="w-12 h-12"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">{data.cityName}</span>
                <span className="text-gray-500"> | </span>
                <span className="text-gray-500">{formatDate(data.raw.dt)}</span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-lg font-bold">{data.currentTemp}°</span>
                <span className="text-lg font-bold">{data.weatherDescription}</span>
                <span className="text-sm text-gray-600">최저 <span className="text-gray-800">{data.minTemp}°</span> | 최고 <span className="text-gray-800">{data.maxTemp}°</span></span>
                <span className="text-sm text-gray-800">{data.windDirection} {data.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-zinc-100 rounded-lg w-full min-h-16 mt-2 mb-4 flex items-center justify-between px-5 py-5 flex-wrap gap-1">
        <div className="flex flex-col gap-2">
          <div className="text-zinc-500 text-xs font-bold">대기질</div>
          <div className="inline-flex justify-start items-end gap-0.5">
            <div className="text-sky-500 text-base font-bold leading-4">1.0</div>
            <div className="text-neutral-400 text-xs font-normal">보통</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-zinc-500 text-xs font-bold">이산화질소</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-lime-600 text-base font-bold leading-4">0.052</div>
            <div className="text-neutral-400 text-xs font-normal">매우좋음</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-zinc-500 text-xs font-bold">미세먼지</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-amber-500 text-base font-bold leading-4">54</div>
            <div className="text-neutral-400 text-xs font-normal">나쁨</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-zinc-500 text-xs font-bold">초미세먼지</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-red-500 text-base font-bold leading-4">100</div>
            <div className="text-neutral-400 text-xs font-normal">매우나쁨</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-zinc-500 text-xs font-bold">현장 환경 지수</div>
          <div className="inline-flex justify-start items-end gap-1">
            <div className="text-lime-600 text-base font-bold leading-4">80</div>
            <div className="text-neutral-400 text-xs font-normal">매우 좋음</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <img
          src={`${import.meta.env.BASE_URL}assets/images/weather-warning.png`}
          alt="경고 날씨 알림"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/images/weather-notice.png`}
          alt="주의 날씨 알림"
        />
        <img
          src={`${import.meta.env.BASE_URL}assets/images/weather-danger.png`}
          alt="위험 날씨 알림"
        />
      </div>
    </div>
  );
}