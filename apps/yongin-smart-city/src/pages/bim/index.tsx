import { useState } from 'react';
import { FBXViewer, IFCViewer } from '@/components/bim';

type ViewerFormat = 'fbx' | 'ifc';

const MODELS = [
  {
    id: 'bridge',
    name: 'Bridge',
    fbxUrl: '/assets/models/Brige.FBX',
    ifcUrl: null,
  },
  {
    id: 'kt-s-parking',
    name: 'KT S동 지하주차장',
    fbxUrl: '/assets/models/KT_S_지하주차장_BA.fbx',
    ifcUrl: '/assets/bim/KT_S_지하주차장_BA.ifc',
  },
];

export default function BimPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [viewerFormat, setViewerFormat] = useState<ViewerFormat>('fbx');

  // IFC가 없는 모델에서 IFC 포맷 선택 시 FBX로 전환
  const effectiveFormat = selectedModel.ifcUrl ? viewerFormat : 'fbx';

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BIM 뷰어</h1>
          <p className="text-gray-600">건물 3D 모델 시각화</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  selectedModel.id === model.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewerFormat('fbx')}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                effectiveFormat === 'fbx'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FBX
            </button>
            <button
              onClick={() => setViewerFormat('ifc')}
              disabled={!selectedModel.ifcUrl}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                effectiveFormat === 'ifc'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } ${!selectedModel.ifcUrl ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              IFC
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {effectiveFormat === 'fbx' ? (
          <FBXViewer
            key={`fbx-${selectedModel.id}`}
            modelUrl={selectedModel.fbxUrl}
            className="h-full w-full"
          />
        ) : (
          <IFCViewer
            key={`ifc-${selectedModel.id}`}
            modelUrl={selectedModel.ifcUrl!}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
