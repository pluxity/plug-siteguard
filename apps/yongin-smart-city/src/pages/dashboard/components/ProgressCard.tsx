import { Button } from "@plug-siteguard/ui";
import { ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react';
import { ProgressData, ProgressProps } from "../types/progress";
import { getProgressColor, progressRows } from "../utils/progressUtils";
import { getProgressData } from '@/services';

export default function ProgressCard() {
    const [data, setData] = useState<ProgressData>({
        planned: 0,
        current: 0,
        difference: 0,
    });

    useEffect(() => {
        getProgressData('MONTH-6')
            .then((progressData) => {
                const latestData = progressData.at(-1);
                const planned = latestData?.planned ?? 0;
                const current = latestData?.current ?? 0;
                setData({
                    planned,
                    current,
                    difference: Math.abs(planned - current),
                });
            })
            .catch((error) => {
                console.error('Failed to fetch progress data:', error);
            });
    }, []);

    const Progress = ({ id, header, getProgress }: ProgressProps) => {
        const color = getProgressColor(id);

        return (
            <div className="flex items-center gap-3">
                {/* 왼쪽 색상 악센트 바 */}
                <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: color }}
                />

                {/* 라벨 */}
                <div className="text-sm text-gray-400 min-w-[70px]">{header}</div>

                {/* 퍼센트 값 */}
                <div
                    className="flex items-baseline text-3xl font-bold ml-auto"
                    style={{ color }}
                >
                    <span>{getProgress(data[id])}</span>
                    <span className="text-xl ml-0.5">%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-72 flex flex-col justify-between bg-[#303741] rounded-lg p-4">
            <div className="flex flex-col gap-4">
                {progressRows.map(row => <Progress key={row.id} {...row} />)}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                <Button className="text-xs text-gray-400 bg-transparent hover:bg-[#444c67] border border-gray-600 transition">
                    <span>Phase 진행 상세</span> <ExternalLink size={12} />
                </Button>
                <Button className="text-xs text-gray-400 bg-transparent hover:bg-[#444c67] border border-gray-600 transition">
                    <span>시공 진행 상세</span> <ExternalLink size={12} />
                </Button>
            </div>
        </div>
    );
}