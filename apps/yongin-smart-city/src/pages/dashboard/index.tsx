import { GridLayout, Widget } from '@plug-siteguard/ui';

import { ProgressCard, ProgressChart, SafetyCard, Weather } from './components';
import { CCTVWHEP } from '@/components/cctvs';
import { Map } from '@/components/map';
import { useCCTVList } from '@/lib/cctv';

export default function Dashboard() {
  const { streams, isLoading } = useCCTVList();

  const readyStreams = streams.filter((stream) => stream.ready).slice(0, 3);

  return (
    <GridLayout columns={10} gap={16}>
      <Widget colSpan={10} className="bg-[#303741]">
        <GridLayout columns={12} gap={12}>
          <Widget className="p-0" colSpan={7} border={false}>
            <ProgressChart />
          </Widget>

          <Widget colSpan={3} border={false} className="self-end" contentClassName="p-0">
            <ProgressCard />
          </Widget>

          <Widget colSpan={2} border={false}>
            <SafetyCard />
          </Widget>
        </GridLayout>
      </Widget>

      <Widget colSpan={4} rowSpan={3} className="bg-white">
        <Weather />
      </Widget>

      <Widget colSpan={6} rowSpan={3} className="bg-white" contentClassName="p-0">
        <Map />
      </Widget>

      <Widget colSpan={10} className="bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            CCTV 목록 로딩 중...
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {readyStreams.map((stream) => (
              <CCTVWHEP key={stream.name} streamPath={stream.name} />
            ))}
          </div>
        )}
      </Widget>
    </GridLayout>
  );
}
