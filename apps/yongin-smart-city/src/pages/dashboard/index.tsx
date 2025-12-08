import { GridLayout, Widget } from '@plug-siteguard/ui';

import { CesiumMap, ProgressCard, ProgressChart, SafetyCard, Weather } from './components';
import { CCTVWHEP } from '@/components/cctvs';

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

          <Widget colSpan={3} border={false} contentClassName="p-0 rounded-none">
            <SafetyCard />
          </Widget>
        </GridLayout>
      </Widget>

      <Widget colSpan={4} rowSpan={3} className="bg-white">
        <Weather />
      </Widget>

      <Widget colSpan={6} rowSpan={3} className="bg-white" contentClassName="p-0">
        <CesiumMap />
      </Widget>

      <Widget colSpan={10} className="bg-white">
        <div className="grid grid-cols-5 gap-4">
          {DASHBOARD_STREAM_IDS.map((streamPath) => (
            <CCTVWHEP key={streamPath} streamPath={streamPath} />
          ))}
        </div>
      </Widget>
    </GridLayout>
  );
}
