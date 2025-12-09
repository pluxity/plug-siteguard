import { Badge, cn } from '@plug-siteguard/ui';

interface EventData {
  id: string;
  status: '안정' | '주의' | '경고' | '위험';
  value: string;
  variant: 'success' | 'warning' | 'destructive';
}

const mockEvents: EventData[] = [
  {
    id: 'event-1',
    status: '안정',
    value: '[D-5] 위험개구부 열림',
    variant: 'success',
  },
  {
    id: 'event-2',
    status: '경고',
    value: '[B-2] 일산화탄소 누출 경고 레벨 감지',
    variant: 'warning',
  },
  {
    id: 'event-3',
    status: '위험',
    value: '[D-5] 위험개구부 열림',
    variant: 'destructive',
  },
  {
    id: 'event-4',
    status: '주의',
    value: '[A-3] 양생온도 상승 주의 레벨 감지',
    variant: 'warning',
  },
  {
    id: 'event-5',
    status: '안정',
    value: '[D-5] 위험개구부 열림',
    variant: 'success',
  },
  {
    id: 'event-6',
    status: '경고',
    value: '[B-2] 일산화탄소 누출 경고 레벨 감지',
    variant: 'warning',
  },
  {
    id: 'event-7',
    status: '위험',
    value: '[D-5] 위험개구부 열림',
    variant: 'destructive',
  },
  {
    id: 'event-8',
    status: '주의',
    value: '[A-3] 양생온도 상승 주의 레벨 감지',
    variant: 'warning',
  },
];

export default function EventList() {
  return (
    <div className="h-full flex flex-col min-h-0 max-h-45">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0"
          >
            <Badge 
              variant={event.variant} 
              className={cn(
                "shrink-0",
                event.status === '경고' && "bg-[#F86700]",
                event.status === '안정' && "bg-[#11C208]",
                event.status === '위험' && "bg-[#CA0014]",
                event.status === '주의' && "bg-[#FDC200] text-[#9E6523]"
              )}
            >
              {event.status}
            </Badge>
            <div className="flex-1 text-sm text-gray-700 min-w-0">
              {event.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}