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
    planned: "#21C3D5",
    current: "#0057FF",
    difference: "#FFFFFF"
  };
export const getProgressColor = (id: keyof ProgressData) => {
  return COLORS[id];
};

// SafetyCard
export const progressLevel = [
    { label: "공정", level: "NORMAL", color: "#11C208", gradient: "linear-gradient(101deg, #11C208 5.72%, #75D204 90.24%)" },
    { label: "품질", level: "NORMAL", color: "#11C208", gradient: "linear-gradient(101deg, #770002 5.72%, #CA0014 90.24%)" },
    { label: "안전", level: "WARNING", color: "#F86700", gradient: "linear-gradient(101deg, #FD6900 5.72%, #FDC200 90.24%)" },
    { label: "환경", level: "DANGER", color: "#CA0014", gradient: "linear-gradient(101deg, #11C208 5.72%, #75D204 90.24%)" },
];