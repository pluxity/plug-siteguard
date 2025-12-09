import { differenceInDays, parse } from "date-fns";
import { CirclePlus } from "lucide-react";
import { progressLevel } from "../utils/progressUtils.ts";
import { StatusCircleProps } from "../types/progress.ts";
import { useMemo } from "react";

export default function SafetyCard() {
  const progressDay = "2023-04-04 00:00:00";

  const difference = useMemo(() => {
    const start = parse(progressDay, "yyyy-MM-dd HH:mm:ss", new Date());
    const now = new Date();
    return differenceInDays(now, start).toString().padStart(4, "0");
  }, [progressDay]);

  const StatusCircle = ({ label, color, gradient }: StatusCircleProps) => {
    return (
      <div
        className="w-24 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer transition-transform hover:scale-105"
        style={{
          background: gradient || color,
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#102642] p-4">
      {/* 타이틀 */}
      <div className="flex items-center justify-center gap-2">
        <CirclePlus className="h-10 w-10 text-[#8FFF2D]" strokeWidth={2} />
        <div className="text-xl text-center text-[#8FFF2D] font-bold whitespace-nowrap">무재해 달성일</div>
      </div>

      {/* 디지털 카운터 */}
      <div className="flex items-center justify-center gap-2 my-4">
        <div className="font-ds-digital text-primary-100 text-7xl font-bold tracking-[6px]">
          {difference}
        </div>
      </div>

      {/* 상태 원형 버튼들 */}
      <div className="grid grid-cols-2 gap-3 place-items-center flex-1 content-center">
        {progressLevel.map(({ label, color, gradient }, index) => (
          <StatusCircle key={index} label={label} color={color} gradient={gradient} />
        ))}
      </div>
    </div>
  );
}
