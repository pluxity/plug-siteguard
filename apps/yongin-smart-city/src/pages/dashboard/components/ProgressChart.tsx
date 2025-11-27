import { Tabs, TabsList, TabsTrigger } from '@plug-siteguard/ui';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getProgressColor, progressRows } from '../utils/progressUtils';
import { ChartData, ChartPeriod } from '../types/progress';

export default function ProgressChart() {
  const [chartRange, setChartRange] = useState<ChartPeriod>("MONTH-6");
  const chartData: ChartData = {
    "MONTH-6": [
      {
        "date": "2025-07-01",
        "planned": 15,
        "current": 23,
        "deviation": 8
      },
      {
        "date": "2025-08-01",
        "planned": 19,
        "current": 34,
        "deviation": 15
      },
      {
        "date": "2025-09-01",
        "planned": 10,
        "current": 15,
        "deviation": 5
      },
      {
        "date": "2025-10-01",
        "planned": 18,
        "current": 8,
        "deviation": -10
      },
      {
        "date": "2025-11-01",
        "planned": 17,
        "current": 27,
        "deviation": 10
      },
      {
        "date": "2025-12-01",
        "planned": 22,
        "current": 31,
        "deviation": 9
      }
    ],
    "MONTH-12": [
      {
        "date": "2025-07-01",
        "planned": 15,
        "current": 23,
        "deviation": 8
      },
      {
        "date": "2025-08-01",
        "planned": 19,
        "current": 34,
        "deviation": 15
      },
      {
        "date": "2025-09-01",
        "planned": 30,
        "current": 30,
        "deviation": 5
      },
      {
        "date": "2025-10-01",
        "planned": 30,
        "current": 30,
        "deviation": -10
      },
      {
        "date": "2025-11-01",
        "planned": 30,
        "current": 30,
        "deviation": 10
      },
      {
        "date": "2025-12-01",
        "planned": 30,
        "current": 30,
        "deviation": 9
      }
    ],
    "ALL": [
      {
        "date": "2025-07-01",
        "planned": 15,
        "current": 15,
        "deviation": 8
      },
      {
        "date": "2025-08-01",
        "planned": 15,
        "current": 15,
        "deviation": 15
      },
      {
        "date": "2025-09-01",
        "planned": 15,
        "current": 15,
        "deviation": 5
      },
      {
        "date": "2025-10-01",
        "planned": 18,
        "current": 8,
        "deviation": -10
      },
      {
        "date": "2025-11-01",
        "planned": 17,
        "current": 27,
        "deviation": 10
      },
      {
        "date": "2025-12-01",
        "planned": 22,
        "current": 31,
        "deviation": 9
      }
    ]
  };

  const handleTabChange = (value: string) => {
    setChartRange(value as ChartPeriod);
  };

  return (
    <div className="h-64 bg-[#303741] rounded-lg">
      <div className="w-full h-55 rounded-lg px-4 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData[chartRange]} margin={{  right: 5, left: -35, }}>
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
                backgroundColor: "#2B3344",
                border: "1px solid #4D566B",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#FFFFFF" }}
            />

            {progressRows.map(({id}) => 
              <Line key={id} type="linear" dataKey={id} stroke={getProgressColor(id, 0)} strokeWidth={2} dot={{ r: 4}} activeDot={{ r: 5, stroke: "#FFFFFF" }} />
              )}

          </LineChart>
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
            <TabsList>
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
