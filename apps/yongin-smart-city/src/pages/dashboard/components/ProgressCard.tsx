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
        const isDifference = id === 'difference';
        const isPlanned = id === 'planned';

        return (
            <div className={`flex items-center gap-3 flex-1 ${isDifference ? 'bg-primary rounded-lg p-3' : ''} ${isPlanned ? 'pb-2  border-b-1 border-dotted border-dashed border-gray-500' : ''}`} >
                {/* 라벨 */}
                <div className={`text-xl min-w-[70px] ${isDifference ? 'text-white font-bold' : 'text-gray-800'}`}>
                    {header}
                </div>

                {/* 퍼센트 값 */}
                <div
                    className={`flex items-baseline ml-auto ${isDifference ? 'text-3xl font-bold' : 'text-2xl'} `}
                    style={{ color }}
                >
                    <span>{getProgress(data[id])}</span>
                    <span className="text-xl ml-0.5">%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-72 flex flex-col justify-between bg-[#C1D5EF] rounded-lg">
            <div className="flex flex-col gap-4 h-full">
                {progressRows.map(row => <Progress key={row.id} {...row} />)}
            </div>
        </div>
    );
}