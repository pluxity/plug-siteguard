import { useWeatherData } from '@/hooks/weather/useWeatherData';
import { formatDate } from '@/services';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@plug-siteguard/ui';
import { MapPin } from 'lucide-react';
import { RadialBarChart, RadialBar } from 'recharts';



const environmentData = [
  {
    name: '초미세먼지(PM2.5)',
    value: 14,
    unit: 'µg/m³',
    status: '양호',
    fill: '#11C208', 
    percentage: 25,
  },
  {
    name: '미세먼지(PM10)',
    value: 45,
    unit: 'µg/m³',
    status: '주의',
    fill: '#FDC200',  
    percentage: 50,
  },
  {
    name: '일산화탄소',
    value: 15,
    unit: 'ppm',
    status: '나쁨',
    fill: '#F86700', 
    percentage: 75,
  },
  {
    name: '소음',
    value: 70,
    unit: 'dB',
    status: '매우나쁨',
    fill: '#CA0014', 
    percentage: 90,
  },
];

const EnvironmentGauge = ({ data }: { data: typeof environmentData[0] }) => {
  const chartData = [
    {
      name: data.name,
      value: 100, 
      fill: '#e5e7eb',
    },
    {
      name: data.name,
      value: data.percentage, 
      fill: data.fill,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <RadialBarChart
          width={128}
          height={128}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={14}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
          <div className="font-bold">{data.value}</div>
          <div className="text-gray-600">{data.unit}</div>
        </div>
      </div>
      <div className="flex flex-col items-center text-xs font-bold mt-2">
        <div className="text-gray-700">{data.name}</div>
        <div style={{ color: data.fill }}>
          {data.status}
        </div>
      </div>
    </div>
  );
};

export default function Weather() {
  const { data, loading, error } = useWeatherData();

  return (
    <div className="h-full flex flex-col rounded-lg gap-4">
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

      <Tabs className="bg-gray-100 rounded-lg" defaultValue="environment"> 
        <TabsList >
          <TabsTrigger value="environment" className="flex-1">환경</TabsTrigger>
          <TabsTrigger value="quality" className="flex-1">품질</TabsTrigger>
          <TabsTrigger value="safety" className="flex-1">안전</TabsTrigger>
          <TabsTrigger value="work" className="flex-1">작업</TabsTrigger>
        </TabsList>
        <TabsContent value="environment" className="px-3 py-13 min-h-[200px]">
          <div className="flex items-center justify-center flex-wrap">
            {environmentData.map((item) => (
              <EnvironmentGauge key={item.name} data={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="quality" className="px-3 py-13 min-h-[200px]">
          <div className="flex items-center justify-center flex-wrap">
            {environmentData.map((item) => (
              <EnvironmentGauge key={item.name} data={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="safety" className="px-3 py-13 min-h-[200px]">
          <div className="flex items-center justify-center flex-wrap">
            {environmentData.map((item) => (
              <EnvironmentGauge key={item.name} data={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="work" className="px-3 py-13 min-h-[200px]">
          <div className="flex items-center justify-center flex-wrap">
            {environmentData.map((item) => (
              <EnvironmentGauge key={item.name} data={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}