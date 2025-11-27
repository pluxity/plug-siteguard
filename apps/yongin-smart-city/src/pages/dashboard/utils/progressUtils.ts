import { ProgressData, ProgressProps } from "../types/progress";

// ProgressCard
const formatPercent = (v: number) => v.toFixed(2).padStart(5, "0");
export const progressRows: ProgressProps[] = [
    {
      id: 'planned',
      header: '계획 공정률',
      getProgress: formatPercent,
    },
    {
      id: 'current',
      header: '현재 공정률',
      getProgress: formatPercent,
    },
    {
      id: 'difference',
      header: '공정률 오차',
      getProgress: formatPercent,
    }
  ];

const COLORS = {
    planned: "#2276fc",
    current: "#5fd4ec",
    difference: "#FC8181"
  };
export const getProgressColor = (id: keyof ProgressData) => {
  return COLORS[id];
};

// SafetyCard
export const progressLevel = [
    { label: "공정", level: "NORMAL", color: "#11C208" },
    { label: "품질", level: "NORMAL", color: "#11C208" },
    { label: "안전", level: "WARNING", color: "#F86700" },
    { label: "환경", level: "DANGER", color: "#CA0014" },
];