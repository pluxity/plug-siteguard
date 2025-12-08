import { GridLayout, Widget } from '@plug-siteguard/ui';

import { ProgressCard, ProgressChart, SafetyCard, Weather } from './components';
import { CCTVWHEP } from '@/components/cctvs';
import { Map } from '@/components/map';

const DASHBOARD_STREAM_IDS = [
  'CCTV-JEJU1-31',
  'CCTV-JEJU1-32',
  'CCTV-JEJU1-33',
  'CCTV-JEJU1-34',
  'CCTV-JEJU1-36',
];

export default function Dashboard() {
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
        <GridLayout columns={1} gap={2}>
          <Widget colSpan={1} border={false} contentClassName="p-4">
            <Weather />
          </Widget>
          <Widget colSpan={1} border={false} contentClassName="p-4" title="실시간 이벤트">
            <div></div>
          </Widget>
        </GridLayout>
      </Widget>
  
      <Widget colSpan={6} rowSpan={2} className="bg-white" contentClassName="p-0">
        <Map />
      </Widget>

      <Widget colSpan={6} rowSpan={3} className="bg-white" title="주요현장 CCTV">
        <div className="grid grid-cols-5 gap-4 h-full">
          {DASHBOARD_STREAM_IDS.map((streamPath) => (
            <CCTVWHEP key={streamPath} streamPath={streamPath} />
          ))}
        </div>
      </Widget>
    </GridLayout>
  );
}

