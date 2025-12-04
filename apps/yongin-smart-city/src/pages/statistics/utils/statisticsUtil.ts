import { Column } from "@plug-siteguard/ui";
import { format } from "date-fns";

export type EventLevel = 'critical' | 'high' | 'low' | 'medium';

export const getLevelType = (level: EventLevel) => {
    switch (level) {
        case 'medium':
            return '중간';
        case 'low':
            return '낮음';
        case 'high':
            return '높음';
        case 'critical':
            return '심각';
        default:
            return '중간';
    }
}

export const statisticsColumns: Column<any>[] = [
    {
        key: 'id',
        header: '번호',
        cell: (_, row) => (
            row.id ? String(row.id) : '-'
        )
    },
    {
        key: 'occurredAt',
        header: '날짜',
        cell: (_, row) => (
            format(new Date(row.occurredAt), 'yyyy-MM-dd')
        ),
    },
    {
        key: 'event_id',
        header: 'ID',
        cell: (_, row) => (
            row.event_id ? String(row.event_id) : '-'
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
        key: 'progress',
        header: '진행작업',
        cell: (_, row) => (
            row.progress ? String(row.progress) : '-'
        )
    },
    {
        key: 'status',
        header: '상태',
        cell: (_, row) => (
            row.status ? String(row.status) : '-'
        )
    },
    {
        key: 'severity',
        header: '위험도',
        cell: (_, row) => (
            row.severity ? getLevelType(row.severity) : '-'
        )
    },
];