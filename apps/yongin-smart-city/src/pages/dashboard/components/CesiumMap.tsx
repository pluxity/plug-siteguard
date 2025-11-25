import { useState, useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { Tabs, TabsList, TabsTrigger, Spinner } from '@plug-siteguard/ui';
import { CameraEventType } from 'cesium';
interface ViewerOptions {
  animation?: boolean;
  baseLayerPicker?: boolean;
  fullscreenButton?: boolean;
  geocoder?: boolean;
  homeButton?: boolean;
  infoBox?: boolean;
  sceneModePicker?: boolean;
  selectionIndicator?: boolean;
  timeline?: boolean;
  navigationHelpButton?: boolean;
  shouldAnimate?: boolean;
  requestRenderMode?: boolean;
  maximumRenderTimeChange?: number;
}

const DEFAULT_VIEWER_OPTIONS: ViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  shouldAnimate: true,
  requestRenderMode: true,
  maximumRenderTimeChange: Infinity,
};


const createViewer = (container: HTMLElement, options?: ViewerOptions): Cesium.Viewer => {
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || '';

  const mergedOptions = { ...DEFAULT_VIEWER_OPTIONS, ...options };
  const viewer = new Cesium.Viewer(container, mergedOptions);

  return viewer;
};

const setupTerrain = async (viewer: Cesium.Viewer, assetId?: number): Promise<void> => {
  if (viewer.isDestroyed()) return;

  const terrainAssetId = assetId || Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID);

  try {
    if (terrainAssetId) {
      const terrainResource = await Cesium.IonResource.fromAssetId(terrainAssetId);
      const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(terrainResource);
      if (!viewer.isDestroyed()) {
        viewer.terrainProvider = terrainProvider;
      }
    }
  } catch (error) {
    console.warn('Failed to load Cesium terrain, using default ellipsoid:', error);
  }
};

export default function CesiumMap() {
  const [activeTab, setActiveTab] = useState('3d-map');
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 추후 탭 변경 시 지도 모드 변경 로직 추가
  };

  useEffect(() => {
    if (!cesiumContainerRef.current) return;

    let removeCameraListener: Cesium.Event.RemoveCallback | undefined;

    const initializeViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const viewer = createViewer(cesiumContainerRef.current!);
        viewerRef.current = viewer;

        const controller = viewer.scene.screenSpaceCameraController;
        controller.minimumZoomDistance = 10;
        controller.maximumZoomDistance = 50000000;
        controller.inertiaZoom = 0.3;
        controller.zoomEventTypes = [CameraEventType.WHEEL, CameraEventType.PINCH];

        // 초기 카메라 위치 설정 (용인시 근처)
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(127.1056, 37.2989, 1000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0,
          },
        });

        // Pitch/Roll 제한 이벤트 리스너
        removeCameraListener = viewer.camera.changed.addEventListener(() => {
          const cameraHeight = viewer.camera.positionCartographic.height;
          const MAX_PITCH_FAR = -0.1; // 약 -5.7도
          const MAX_PITCH_MID = -0.2; // 약 -11도
          const MAX_PITCH_NEAR = -0.3; // 약 -17도
          const NEAR_HEIGHT_THRESHOLD = 1000;
          const MID_HEIGHT_THRESHOLD = 5000;
          const ROLL_THRESHOLD = 0.01;

          let adjustedMaxPitch = MAX_PITCH_FAR;
          if (cameraHeight < NEAR_HEIGHT_THRESHOLD) {
            adjustedMaxPitch = MAX_PITCH_NEAR;
          } else if (cameraHeight < MID_HEIGHT_THRESHOLD) {
            adjustedMaxPitch = MAX_PITCH_MID;
          }

          const { pitch, roll } = viewer.camera;

          if (pitch > adjustedMaxPitch || Math.abs(roll) > ROLL_THRESHOLD) {
            viewer.camera.setView({
              destination: viewer.camera.position,
              orientation: {
                heading: viewer.camera.heading,
                pitch: Math.min(pitch, adjustedMaxPitch),
                roll: 0,
              },
            });
          }
        });

        await setupTerrain(viewer);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize viewer:', err);
        setError('지도를 로드하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    initializeViewer();

    return () => {
      removeCameraListener?.();
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

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
                bg-white data-[state=active]:bg-[#FF7500] data-[state=active]:text-white !hover:bg-[#FF7500]/10 data-[state=active]:hover:bg-[#FF7500] transition-colors duration-200
              `}
            >
              2D MAP
            </TabsTrigger>
            <TabsTrigger
              value="3d-map"
              className={`
                w-[70px] px-[10px] py-2 !border-r !border-[#FF7500] border-0 text-[#FF7500] text-xs font-bold bg-white cursor-pointer
                rounded-none data-[state=active]:bg-[#FF7500] data-[state=active]:text-white !hover:bg-[#FF7500]/10 data-[state=active]:hover:bg-[#FF7500] transition-colors duration-200
              `}
            >
              3D MAP
            </TabsTrigger>
            <TabsTrigger
              value="bim"
              className={`
                w-[70px] px-[10px] py-2 text-[#FF7500] text-xs font-bold rounded-none last:rounded-r-[7px] data-[state=active]:bg-[#FF7500] data-[state=active]:text-white
                !hover:bg-[#FF7500]/10 data-[state=active]:hover:bg-[#FF7500] transition-colors duration-200 bg-white cursor-pointer
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
