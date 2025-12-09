import { GridLayout, Widget } from '@plug-siteguard/ui';

import { ProgressCard, ProgressChart, SafetyCard, Weather, EventList } from './components';
import { CCTVWHEP } from '@/components/cctvs';
import { Map } from '@/components/map';
import { useCCTVList } from '@/lib/cctv';

export default function Dashboard() {
  const { streams, isLoading } = useCCTVList();

  const readyStreams = [...streams].sort((a, b) => Number(b.ready) - Number(a.ready)).slice(0, 3);

  return (
    <GridLayout columns={10} gap={16}>
      <Widget colSpan={10} className="bg-[#C1D5EF]" contentClassName="p-0">
        <GridLayout columns={12} gap={12}>
          <Widget colSpan={6} border={false} contentClassName="p-4">
            <ProgressChart />
          </Widget>

          <Widget colSpan={3} border={false} contentClassName="p-4">
            <ProgressCard />
          </Widget>

          <Widget colSpan={3} border={false} className="rounded-none" contentClassName="p-0">
            <SafetyCard />
          </Widget>
        </GridLayout>
      </Widget>

      <Widget colSpan={4} rowSpan={5} className="bg-white">
        <GridLayout columns={1} gap={2} >
          <Widget colSpan={1} border={false} contentClassName="p-2">
            <Weather />
          </Widget>
          <Widget colSpan={1} border={false} contentClassName="p-2" title="실시간 이벤트">
            <EventList />
          </Widget>
        </GridLayout>
      </Widget>

      <Widget colSpan={6} rowSpan={2} className="bg-white" contentClassName="p-0">
        <Map />
      </Widget>

      <Widget colSpan={6} rowSpan={3} className="bg-white" title="주요현장 CCTV">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            CCTV 목록 로딩 중...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 h-full min-h-[180px]">
            {readyStreams.map((stream) => (
              <CCTVWHEP key={stream.name} streamPath={stream.name} />
            ))}
          </div>
        )}
      </Widget>
    </GridLayout>
  );
}
 
