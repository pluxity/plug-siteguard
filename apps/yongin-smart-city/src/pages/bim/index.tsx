import { useState } from 'react';
import { FBXViewer, IFCViewer, MultiFBXViewer, CHANGNYEONG_FLOORS } from '@/components/bim';

type ViewerType = 'single' | 'multi';
type ViewerFormat = 'fbx' | 'ifc';

const SINGLE_MODELS = [
  {
    id: 'kt-s-parking',
    name: 'KT S동 지하주차장',
    fbxUrl: '/assets/models/KT_S_지하주차장_BA.fbx',
    ifcUrl: '/assets/bim/KT_S_지하주차장_BA.ifc',
  },
  {
    id: 'kt-n-building',
    name: 'KT N동 B동',
    fbxUrl: '/assets/models/KT_N_B동_BA.fbx',
    ifcUrl: '/assets/bim/KT_N_B동_BA.ifc',
  },
];

const MULTI_MODELS = [
  {
    id: 'changnyeong',
    name: '창녕문화예술회관',
    basePath: '/assets/models/창녕문화예술회관',
    floors: CHANGNYEONG_FLOORS,
  },
];

export default function BimPage() {
  const [viewerType, setViewerType] = useState<ViewerType>('multi');
  const [selectedSingleModel, setSelectedSingleModel] = useState(SINGLE_MODELS[0]);
  const [selectedMultiModel, setSelectedMultiModel] = useState(MULTI_MODELS[0]);
  const [viewerFormat, setViewerFormat] = useState<ViewerFormat>('fbx');

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BIM 뷰어</h1>
          <p className="text-gray-600">건물 3D 모델 시각화</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewerType('multi')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewerType === 'multi'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              층별 뷰어
            </button>
            <button
              onClick={() => setViewerType('single')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewerType === 'single'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              단일 모델
            </button>
          </div>

          {viewerType === 'single' && (
            <>
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setViewerFormat('fbx')}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    viewerFormat === 'fbx'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  FBX
                </button>
                <button
                  onClick={() => setViewerFormat('ifc')}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    viewerFormat === 'ifc'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  IFC
                </button>
              </div>

              <div className="flex items-center gap-2">
                {SINGLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedSingleModel(model)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      selectedSingleModel.id === model.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {viewerType === 'multi' && (
            <div className="flex items-center gap-2">
              {MULTI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedMultiModel(model)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    selectedMultiModel.id === model.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {viewerType === 'multi' ? (
          <MultiFBXViewer
            key={`multi-${selectedMultiModel.id}`}
            basePath={selectedMultiModel.basePath}
            files={selectedMultiModel.floors}
          />
        ) : viewerFormat === 'fbx' ? (
          <FBXViewer
            key={`fbx-${selectedSingleModel.id}`}
            modelUrl={selectedSingleModel.fbxUrl}
            className="h-full w-full"
          />
        ) : (
          <IFCViewer
            key={`ifc-${selectedSingleModel.id}`}
            modelUrl={selectedSingleModel.ifcUrl}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
