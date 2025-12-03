import { useState, useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useViewerStore } from '@/stores';
import { Spinner } from '@plug-siteguard/ui';

export default function MapPage() {
  const { createViewer, initializeResources } = useViewerStore();
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(127.1038, 37.2842, 500),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-10),
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
    <div className="relative w-full h-full">
      <div className="absolute inset-0" ref={cesiumContainerRef}>
        {isLoading && (
          <div className="absolute z-10 inset-0 flex gap-2 items-center justify-center bg-black/10 text-white">
            <Spinner className="w-5 h-5"/> 지도 로딩 중...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
