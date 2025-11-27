import { Button } from "@plug-siteguard/ui";
import { ExternalLink } from 'lucide-react'
import { ProgressData, ProgressProps } from "../types/progress";
import { getProgressColor, progressRows } from "../utils/progressUtils";


export default function ProgressCard() {
    const data: ProgressData = {
        planned: 45.2,
        current: 48.1,
        difference: 3.1,
    };

    const Progress = ({ id, header, getProgress }: ProgressProps) => {
        return (
            <div className="flex justify-between items-center border !border-gray-700 rounded-lg bg-[#364057] px-4 py-3">
                <div className="text-sm text-gray-100">{header}</div>
                <div className="flex text-4xl font-extrabold" style={{ color: getProgressColor(id, data[id]) }}>
                    <span>{getProgress(data[id])}</span>
                    <span className="text-2xl self-end">%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-64 flex flex-col gap-1">
            {progressRows.map(row => <Progress key={row.id} {...row} />)}

            <div className="grid grid-cols-2 gap-3 py-3">
                <Button className="text-xs text-gray-300 bg-[#303741] hover:bg-[#444c67] border !border-gray-700 transition">
                    <span>Phase 진행 상세</span> <ExternalLink />
                </Button>
                <Button className="text-xs text-gray-300 bg-[#303741] hover:bg-[#444c67] border !border-gray-700 transition">
                    <span>시공 진행 상세</span> <ExternalLink />
                </Button>
            </div>
        </div>
    );
}