import { memo } from 'react';
import { CCTVWHEP } from '@/components/cctvs';
import type { CCTVInfo } from '@/lib/whep/types';

interface CCTVGridCellProps {
  cctv: CCTVInfo | undefined;
  isPTZMode: boolean;
  gridSize: '1x1' | '2x2' | '1+5' | '4x4' | '8x8';
}

function CCTVGridCell({ cctv, isPTZMode, gridSize }: CCTVGridCellProps) {
  if (!cctv) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
        <span className="text-sm">No Signal</span>
      </div>
    );
  }

  return (
    <CCTVWHEP
      streamPath={cctv.id}
      className="w-full h-full"
      hasPTZ={cctv.ptz}
      gridSize={gridSize}
      showPTZControls={isPTZMode}
      ptzSpeed={20}
    />
  );
}

export default memo(CCTVGridCell, (prev, next) => {
  // CCTV ID가 같고 모드가 같으면 리렌더링 방지
  return (
    prev.cctv?.id === next.cctv?.id &&
    prev.isPTZMode === next.isPTZMode &&
    prev.gridSize === next.gridSize
  );
});
