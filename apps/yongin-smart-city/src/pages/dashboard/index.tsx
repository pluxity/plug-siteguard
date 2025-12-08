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
        <div className="grid grid-cols-5 gap-4">
          {DASHBOARD_STREAM_IDS.map((streamPath) => (
            <CCTVWHEP key={streamPath} streamPath={streamPath} />
          ))}
        </div>
      </Widget>
    </GridLayout>
  );
}
