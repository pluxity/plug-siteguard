export interface ChartItem {
  date: string;
  planned: number;
  current: number;
  deviation: number;
}

export interface ChartData {
  "MONTH-6": ChartItem[];
  "MONTH-12": ChartItem[];
  "ALL": ChartItem[];
}

export type ChartPeriod = "MONTH-6" | "MONTH-12" | "ALL";

export interface ProgressData {
  planned: number;
  current: number;
  difference: number;
}

export interface ProgressProps {
  id: keyof ProgressData;
  header: string;
  getProgress: (v: number) => string;
}