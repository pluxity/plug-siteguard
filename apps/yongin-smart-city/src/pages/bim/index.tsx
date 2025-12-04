import { FBXViewer } from '@/components/bim';

export default function BimPage() {
  return (
    <div className="h-full w-full">
      <FBXViewer
        modelUrl="assets/models/KT_S_지하주차장_BA.fbx"
        rotation={[-Math.PI / 2, 0, 0]}
        className="h-full w-full"
      />
    </div>
  );
}
