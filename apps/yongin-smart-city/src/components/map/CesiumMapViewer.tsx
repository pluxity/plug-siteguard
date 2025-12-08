import { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import { Spinner } from '@plug-siteguard/ui';
import { useViewerStore } from '@/stores';
import { DEFAULT_CAMERA_POSITION } from '@/stores/cesium/types';

type CesiumMapMode = '2d-map' | '3d-map';

interface CesiumMapViewerProps {
  mode: CesiumMapMode;
}

export function CesiumMapViewer({ mode }: CesiumMapViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const { createViewer, initializeResources } = useViewerStore();

  useEffect(() => {
    if (viewerRef.current) return;
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

        const destination = Cesium.Cartesian3.fromRadians(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat,
          DEFAULT_CAMERA_POSITION.height
        );
        const orientation = {
          heading: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.heading ?? 0),
          pitch: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.pitch ?? -45),
          roll: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.roll ?? 0),
        };
        viewer.camera.setView({ destination, orientation });

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

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const controller = viewer.scene.screenSpaceCameraController;

    if (mode === '2d-map') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat + 0.0005,
          2000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0),
        },
        duration: 1.5,
      });

      controller.enableTilt = false;
    } else if (mode === '3d-map') {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(
          DEFAULT_CAMERA_POSITION.lon,
          DEFAULT_CAMERA_POSITION.lat,
          DEFAULT_CAMERA_POSITION.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.heading ?? 0),
          pitch: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.pitch ?? -45),
          roll: Cesium.Math.toRadians(DEFAULT_CAMERA_POSITION.roll ?? 0),
        },
        duration: 1.5,
      });

      controller.enableTilt = true;
    }
  }, [mode]);

  return (
    <>
      <div
        ref={cesiumContainerRef}
        className="absolute inset-0 w-full h-full rounded-lg"
      />
      {isLoading && (
        <div className="absolute inset-0 flex gap-2 items-center justify-center bg-black/10">
          <Spinner className="w-5 h-5" /> 지도 로딩 중...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          {error}
        </div>
      )}
    </>
  );
}
