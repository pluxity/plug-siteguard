import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@plug-siteguard/ui';
import { FBXViewer } from '@/components/bim';
import { CesiumMapViewer } from './CesiumMapViewer';

type MapMode = '2d-map' | '3d-map' | 'bim';

export default function Map() {
  const [mapMode, setMapMode] = useState<MapMode>('3d-map');

  const handleTabChange = (value: string) => {
    setMapMode(value as MapMode);
  };

  return (
    <div className="h-full min-h-[450px] flex items-center justify-center rounded-lg relative">
      {/* 탭 메뉴 */}
      <div className="absolute top-4 left-4 z-10">
        <Tabs value={mapMode} onValueChange={handleTabChange}>
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

      {/* 컨텐츠 영역 */}
      {mapMode === 'bim' ? (
        <FBXViewer
          modelUrl="assets/models/KT_S_지하주차장_BA.fbx"
          rotation={[-Math.PI / 2, 0, 0]}
          className="w-full h-full"
        />
      ) : (
        <CesiumMapViewer mode={mapMode} />
      )}
    </div>
  );
}
