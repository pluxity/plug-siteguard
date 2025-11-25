import { Skeleton } from '@plug-siteguard/ui';

import { useCCTVList } from '../../lib/webrtc';
import { CCTV } from '../dashboard/components';

export default function CctvPage() {
  const { cctvList, loading } = useCCTVList();

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">CCTV 모니터링</h1>
        <p className="text-gray-600">전체 {cctvList.length}개 스트림</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {cctvList.map((cctv) => (
          <CCTV key={cctv.id} streamId={cctv.id} />
        ))}
      </div>
    </div>
  );
}
