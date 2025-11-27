import { differenceInDays ,parse } from "date-fns";
import { CirclePlus } from "lucide-react";

interface StatusCircleProps {
  label: string;
  level: string;
}

export default function SafetyCard() {
  const progressDay = "2025-10-27 14:12:28";

  const differenceDays = () => {
    const start = parse(progressDay, "yyyy-MM-dd HH:mm:ss", new Date());
    const now = new Date();
    differenceInDays(now, start).toString().padStart(4, "0");
    return differenceInDays(now, start).toString().padStart(4, "0");;
  };

  const progress = [
    { label: "공정", level: "NORMAL" },
    { label: "품질", level: "NORMAL" },
    { label: "안전", level: "WARNING" },
    { label: "환경", level: "DANGER" },
  ];
    
  const getProcessLevelColor = (level: string): string => {
    switch (level) {
      case 'NORMAL':
        return '#11C208' 
      case 'WARNING':
        return '#F86700'
      case 'DANGER':
        return '#CA0014' 
      default:
        return '#11C208' 
    };
  };

  const StatusCircle = ({ label, level }: StatusCircleProps) => {
    const color = getProcessLevelColor(level);

    return (
      <div
        className="w-15 h-15 rounded-full flex items-center justify-center text-white font-bold"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}50`,
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="h-64 rounded-lg space-y-1 bg-gray-800 gap-3 p-2">
      <div className="text-base text-center text-slate-400">무재해 달성일</div>
      <div className="text-xs text-gray-400">2024.04.04 ~</div>
      <div className="font-ds-digital text-[#8FFF2D] flex justify-evenly items-center text-5xl font-bold text-green-400">
        <CirclePlus className="h-8 w-8 text-lime-400"/>
        <div className="justify-start text-lime-400 text-5xl font-bold font-['DS-Digital'] tracking-[8px]">{differenceDays()}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 place-items-center">
        {progress.map(({label, level}) => <StatusCircle key={label} label={label} level={level} />)}
      </div>
    </div>
  );
}
