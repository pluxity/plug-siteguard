import { useState, useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { Tabs, TabsList, TabsTrigger, Spinner } from '@plug-siteguard/ui';
import { useViewerStore } from '../../../stores/cesium/viewerStore';

export default function CesiumMap() {
  const [activeTab, setActiveTab] = useState('3d-map');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const { createViewer, initializeResources } = useViewerStore();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 추후 탭 변경 시 지도 모드 변경 로직 추가
  };

  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    const initViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const viewer = createViewer(cesiumContainerRef.current!);
        viewerRef.current = viewer;

        await initializeResources(viewer, {
          loadTerrain: true,
        });

        // 초기 카메라 위치 설정 (구성역)
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(127.1056, 37.2989, 1000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
          },
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize viewer:', err);
        setError('지도를 로드하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [createViewer, initializeResources]);

  return (
    <div className="h-full min-h-[450px] flex items-center justify-center rounded-lg relative">
      <div className="absolute top-4 left-4 z-10">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList 
            className="overflow-hidden rounded-[7px] border border-[#FF7500] outline outline-1 outline-[#FF7500] outline-offset-[-1px] p-0 h-auto bg-transparent inline-flex items-center justify-center"
          >
            <TabsTrigger
              value="2d-map"
              className={`
                w-[70px] px-[10px] py-2 !border-r !border-[#FF7500] border-0 text-[#FF7500] text-xs font-bold rounded-none first:rounded-l-[7px] cursor-pointer
                bg-white hover:!bg-white data-[state=active]:bg-[#FF7500] data-[state=active]:text-white data-[state=active]:hover:!bg-[#FF7500] transition-colors duration-200
              `}
            >
              2D MAP
            </TabsTrigger>
            <TabsTrigger
              value="3d-map"
              className={`
                w-[70px] px-[10px] py-2 !border-r !border-[#FF7500] border-0 text-[#FF7500] text-xs font-bold bg-white hover:!bg-white cursor-pointer
                rounded-none data-[state=active]:bg-[#FF7500] data-[state=active]:text-white data-[state=active]:hover:!bg-[#FF7500] transition-colors duration-200
              `}
            >
              3D MAP
            </TabsTrigger>
            <TabsTrigger
              value="bim"
              className={`
                w-[70px] px-[10px] py-2 text-[#FF7500] text-xs font-bold rounded-none last:rounded-r-[7px] data-[state=active]:bg-[#FF7500] data-[state=active]:text-white
                data-[state=active]:hover:!bg-[#FF7500] transition-colors duration-200 bg-white hover:!bg-white cursor-pointer
              `}
            >
              BIM
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div 
        ref={cesiumContainerRef} 
        className="absolute inset-0 w-full h-full rounded-lg"
      />
      {isLoading && (
        <div className="absolute inset-0 flex gap-2 items-center justify-center bg-black/10">
          <Spinner className="w-5 h-5"/> 지도 로딩 중...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          {error}
        </div>
      )}
    </div>
  );
}
