import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProgressColor, progressRows } from '../utils/progressUtils';
import { getAllProgressData, type ProgressResponse, type ProgressDataPoint } from '@/services';

export default function ProgressChart() {
  const [chartData, setChartData] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    getAllProgressData()
      .then(setChartData)
      .catch((error) => {
        console.error('Failed to fetch progress data:', error);
      });
  }, []);

  const currentData: ProgressDataPoint[] = chartData?.["MONTH-6"] ?? [];

  return (
    <div className="bg-[#C1D5EF] rounded-lg">
      <div className="w-full mb-4">
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
            <CartesianGrid vertical={false} horizontal={true} stroke="#FFF" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#5C6488", fontSize: 12 }}
              axisLine={{ stroke: "#FFF" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#5C6488", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
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
        <div className="flex items-end gap-4 text-[#455163]">
          <div className="flex items-end gap-4 font-bold">
            <span className="text-xl">공정률</span> 
            <span className="text-xs">단위: %, 누적</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500" style={{backgroundColor: getProgressColor("planned")}} />
            <span>계획 공정율</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: getProgressColor("current")}} />
            <span>진행 누적 공정율</span>
          </div>
        </div>
      </div>
    </div>
  );
}
