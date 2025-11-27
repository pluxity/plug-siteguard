import { GridLayout, Skeleton } from '@plug-siteguard/ui';

import { useCCTVList } from '../../lib/webrtc';

import { default as HLSCCTV } from '../dashboard/components/CCTV-HLS';
import { default as WEBRTCCCTV } from '../dashboard/components/CCTV-WebRTC';

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
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">CCTV 모니터링</h1>
        <p className="text-gray-600">전체 {cctvList.length * 2}개 스트림 (HLS + WebRTC)</p>
      </div>

      <GridLayout columns={4} gap={20} className="flex-1">
        {cctvList.map((cctv) => (
          <>
            <HLSCCTV key={`hls-${cctv.id}`} streamId={cctv.id} />
            <WEBRTCCCTV key={`webrtc-${cctv.id}`} streamId={cctv.id} />
          </>
        ))}
      </GridLayout>
    </div>
  );
}
