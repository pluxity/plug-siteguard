import { ProgressData, ProgressProps } from "../types/progress";

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
    planned: "#2276FC",
    current: "#5FD5EC",
    difference: "#FC8181"
  };
export const getProgressColor = (id: keyof ProgressData, value: number = 0) => {
  if (id !== "difference") return COLORS[id];
  return value < 0 ? COLORS.difference : COLORS.planned;
};