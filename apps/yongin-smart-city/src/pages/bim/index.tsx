import { useState } from 'react';
import { FBXViewer, IFCViewer } from '@/components/bim';

type ViewerFormat = 'fbx' | 'ifc';

const BIM_MODELS = [
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

export default function BimPage() {
  const [selectedModel, setSelectedModel] = useState(BIM_MODELS[0]);
  const [viewerFormat, setViewerFormat] = useState<ViewerFormat>('fbx');

  return (
    <div className="p-4 h-full flex flex-col">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BIM 뷰어</h1>
          <p className="text-gray-600">건물 3D 모델 시각화</p>
        </div>

        <div className="flex items-center gap-4">
          {/* 포맷 선택 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewerFormat('fbx')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewerFormat === 'fbx'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FBX
            </button>
            <button
              onClick={() => setViewerFormat('ifc')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewerFormat === 'ifc'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              IFC
            </button>
          </div>

          {/* 모델 선택 */}
          <div className="flex items-center gap-2">
            {BIM_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedModel.id === model.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D 뷰어 */}
      <div className="flex-1 min-h-0">
        {viewerFormat === 'fbx' ? (
          <FBXViewer
            key={`fbx-${selectedModel.id}`}
            modelUrl={selectedModel.fbxUrl}
            className="w-full h-full"
          />
        ) : (
          <IFCViewer
            key={`ifc-${selectedModel.id}`}
            modelUrl={selectedModel.ifcUrl}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
