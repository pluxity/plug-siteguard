import { useState } from 'react';
import { FBXViewer } from '@/components/bim';

const MODELS = [
  {
    id: 'bridge',
    name: 'Bridge',
    url: '/assets/models/Brige.FBX',
    rotation: [0, 0, 0] as [number, number, number],
  },
  {
    id: 'kt-s-parking',
    name: 'KT S동 지하주차장',
    url: '/assets/models/KT_S_지하주차장_BA.fbx',
    rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
  },
];

export default function BimPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BIM 뷰어</h1>
          <p className="text-gray-600">건물 3D 모델 시각화</p>
        </div>

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
      </div>

      <div className="min-h-0 flex-1">
        <FBXViewer
          key={selectedModel.id}
          modelUrl={selectedModel.url}
          rotation={selectedModel.rotation}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
