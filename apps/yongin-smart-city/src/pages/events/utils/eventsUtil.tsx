import { Events } from "@/services";
import { Column } from "@plug-siteguard/ui";
import { format } from "date-fns";

export type EventLevel = 'CAUTION' | 'WARNING' | 'DANGER';

export const getLevelType = (level: EventLevel) => {
    switch (level) {
        case 'CAUTION':
            return {
                bgColor: 'bg-yellow-400',
                textColor: 'text-yellow-700',
                text: '주의'
            };
        case 'WARNING':
            return {
                bgColor: 'bg-orange-600',
                textColor: 'text-orange-600',
                text: '경고'
            };
        case 'DANGER':
            return {
                bgColor: 'bg-red-700',
                textColor: 'text-red-700',
                text: '위험'
            };
        default:
            return {
                bgColor: 'bg-yellow-400',
                textColor: 'text-yellow-700',
                text: '주의'
            };
    }
}

export const eventsColumns: Column<Events>[] = [
    {
        key: 'id',
        header: '번호',
        cell: (_, row) => (
            row.id ? String(row.id) : '-'
        )
    },
    {
        key: 'location',
        header: '작업구역',
        cell: (_, row) => (
            row.location ? String(row.location) : '-'
        )
    },
    {
        key: 'deviceNm',
        header: '장비명',
        cell: (_, row) => (
            row.deviceNm ? String(row.deviceNm) : '-'
        )
    },
    {
        key: 'status',
        header: '이벤트 등급',
        cell: (_, row) => {
            const levelType = getLevelType(row.status as EventLevel);
            return (
                <div className="flex items-center justify-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${levelType.bgColor}`}></div>
                    <span className={levelType.textColor}>{levelType.text}</span>
                </div>
            )
        },
    },
    {
        key: 'eventNm',
        header: '이벤트명',
        cell: (_, row) => {
            const levelType = getLevelType(row.status as EventLevel);
            return (
                <span className={row.status != 'CAUTION' ? levelType.textColor : ''}>
                    {row.eventNm ? String(row.eventNm) : '-'}
                </span>
            )
        }
    },
    {
        key: 'occurredAt',
        header: '발생일시',
        cell: (_, row) => (
            row.occurredAt ? format(new Date(row.occurredAt), 'yyyy-MM-dd | HH:mm:ss') : '-'
        ),
    },
    {
        key: 'resolvedAt',
        header: '해제일시',
        cell: (_, row) => (
            row.resolvedAt ? format(new Date(row.resolvedAt), 'yyyy-MM-dd | HH:mm:ss') : '-'
        ),
    },
];