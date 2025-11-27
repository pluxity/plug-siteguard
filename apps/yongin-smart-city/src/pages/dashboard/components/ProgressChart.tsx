import { Tabs, TabsList, TabsTrigger } from '@plug-siteguard/ui';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProgressColor, progressRows } from '../utils/progressUtils';
import { ChartPeriod } from '../types/progress';
import chartData from '../../../data/sample_data.json';

export default function ProgressChart() {
  const [chartRange, setChartRange] = useState<ChartPeriod>("MONTH-6");

  const handleTabChange = (value: string) => {
    setChartRange(value as ChartPeriod);
  };

  const currentData = chartData[chartRange];

  return (
    <div className="bg-[#303741] rounded-lg px-4 pt-4">
      <div className="w-full">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={currentData} margin={{ right: 5, left: -35 }}>
            <defs>
              <linearGradient id="gradientPlanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2276fc" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2276fc" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5fd4ec" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5fd4ec" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} stroke="#3C4458" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#9AA3B8", fontSize: 12 }}
              axisLine={true}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9AA3B8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value, name) => {
                const labelMap: Record<string, string> = {
                  planned: "계획수치",
                  current: "진행수치",
                };
                return [value, labelMap[name] ?? name];
              }}
              contentStyle={{
                backgroundColor: "#2b334452",
                border: "1px solid #4D566B",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#FFFFFF" }}
            />

            {progressRows.filter(({id}) => id !== 'difference').map(({id}) =>
              <Area
                key={id}
                type="linear"
                dataKey={id}
                stroke={getProgressColor(id)}
                strokeWidth={2}
                strokeOpacity={1}
                fill={`url(#gradient${id.charAt(0).toUpperCase() + id.slice(1)})`}
                fillOpacity={0.6}
                dot={{ r: 2.5, fill: "#FFFFFF", stroke: getProgressColor(id), strokeWidth: 1.5 }}
                activeDot={{ r: 4, fill: "#FFFFFF", stroke: getProgressColor(id), strokeWidth: 2 }}
              />
            )}

          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center px-5 text-white">
        <div className="flex items-center gap-2">
          <span className="text-xl">공정률</span>
          <span className="text-xs text-gray-500">최종데이터 2025.12.11</span>
        </div>

        <div className="text-xs flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" style={{backgroundColor: getProgressColor("planned")}} />
            <span>계획수치</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: getProgressColor("current")}} />
            <span>진행수치</span>
          </div>

          <Tabs defaultValue="MONTH-6" size="sm" onValueChange={handleTabChange}>
            <TabsList className="bg-transparent border-2 p-0 text-white rounded-lg">
              <TabsTrigger value="MONTH-6">6개월</TabsTrigger>
              <TabsTrigger value="MONTH-12">12개월</TabsTrigger>
              <TabsTrigger value="ALL">전체</TabsTrigger>
            </TabsList> 
          </Tabs>
        </div>
      </div>
    </div>
  );
}
