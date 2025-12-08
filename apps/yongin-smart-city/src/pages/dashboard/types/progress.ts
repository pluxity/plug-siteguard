// ProgressChart
export interface ChartItem {
  date: string;
  planned: number;
  current: number;
  deviation?: number;
}

export interface ChartData {
  "MONTH-6": ChartItem[];
  "MONTH-12": ChartItem[];
  "ALL": ChartItem[];
}

export type ChartPeriod = "MONTH-6" | "MONTH-12" | "ALL";

// ProgressCard
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

// SafetyCard
export interface StatusCircleProps {
  label: string;
  color: string;
  gradient?: string;
}