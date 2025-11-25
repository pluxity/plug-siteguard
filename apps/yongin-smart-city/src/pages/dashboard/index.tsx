import { GridLayout, Widget } from '@plug-siteguard/ui';
import {
  ProgressChart,
  ProgressCard,
  SafetyCard,
  Weather,
  CesiumMap,
  CCTV,
} from './components';

export default function Dashboard() {
  return (
    <GridLayout columns={10} gap={16}>
      <Widget colSpan={10} className="bg-gray-900" >
        <GridLayout columns={12} gap={12}>
          <Widget colSpan={8} border={false}>
            <ProgressChart />
          </Widget>

          <Widget colSpan={2} border={false}>
            <ProgressCard />
          </Widget>

          <Widget colSpan={2} border={false}>
            <SafetyCard />
          </Widget>
        </GridLayout>
      </Widget>

      <Widget colSpan={3} rowSpan={3} className="bg-white">
        <Weather />
      </Widget>

      <Widget colSpan={7} rowSpan={3} className="bg-white">
        <CesiumMap />
      </Widget>

      <Widget colSpan={10} className="bg-white">
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <CCTV key={i} id={i} />
          ))}
        </div>
      </Widget>
    </GridLayout>
  );
}
