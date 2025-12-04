# Engine Library

React Three Fiber 기반 3D 엔진 라이브러리.

## 설치

프로젝트에 이미 포함되어 있습니다.

## 사용법

### 기본 Import

```tsx
import {
  // Camera
  CameraControls,
  useFitToModel,

  // Loaders
  loadFBX,
  useFBXLoader,
  FBXModel,
  loadGLTF,
  useGLTFLoader,
  GLTFModel,
  useGLTFAnimation,

  // Stores
  useModelStore,
  useModelLoadingStatus,
  useModelLoadingProgress,
  useLoadedModel,
  useModelIds,
  useCameraStore,
  useCameraConfig,
  useOrbitTarget,

  // Types
  MouseButton,
} from '@/lib/engine';
```

### CameraControls

클릭 지점 기반 회전 피벗을 지원하는 카메라 컨트롤.

```tsx
<Canvas>
  <CameraControls
    enabled={true}
    rotateButton={MouseButton.Left}
    panButton={MouseButton.Right}
    dragZoomButton={MouseButton.Middle}
    rotateSmoothingFactor={0.6}
    panSmoothingFactor={0.7}
    zoomSpeed={1.0}
    showPivot={true}
  />
</Canvas>
```

**조작법:**
- 좌클릭 드래그: 회전 (클릭 지점 기준)
- 우클릭 드래그: 패닝 (바닥 평면)
- Shift + 우클릭 드래그: 스크린 패닝
- 휠: 줌 (마우스 위치 방향)
- 중클릭 드래그: 드래그 줌

### FBX 모델 로드

```tsx
// 컴포넌트 방식
<FBXModel
  id="building"
  url="/assets/models/building.fbx"
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
  scale={1}
  centerModel={true}
  onLoad={(model) => console.log('Loaded:', model)}
  onError={(err) => console.error('Error:', err)}
/>

// 훅 방식
function MyComponent() {
  const { load, unload } = useFBXLoader();

  useEffect(() => {
    load('building', '/assets/models/building.fbx');
    return () => unload('building');
  }, []);

  return null;
}
```

### GLTF/GLB 모델 로드

```tsx
// 컴포넌트 방식
<GLTFModel
  id="model"
  url="/assets/models/model.glb"
  position={[0, 0, 0]}
  scale={1}
/>

// 훅 방식 (DRACO 압축 지원)
const { load, unload } = useGLTFLoader();
await load('model', '/assets/models/model.glb');
```

### 애니메이션

```tsx
function AnimatedModel() {
  const { play, stop, stopAll, getAnimationNames } = useGLTFAnimation('model-id');

  useEffect(() => {
    const names = getAnimationNames();
    if (names.length > 0) {
      play(names[0], { loop: true });
    }
  }, []);

  return null;
}
```

### Store 사용

```tsx
// 모델 상태
const model = useLoadedModel('building');
const status = useModelLoadingStatus('building');
const progress = useModelLoadingProgress('building');
const modelIds = useModelIds();

// 직접 스토어 접근
const addModel = useModelStore((state) => state.addModel);
const clearModels = useModelStore((state) => state.clearModels);

// 카메라 상태
const config = useCameraConfig();
const target = useOrbitTarget();
const setOrbitTarget = useCameraStore((state) => state.setOrbitTarget);
```

### 카메라 Fit to Model

```tsx
function Scene() {
  const { fitToModel } = useFitToModel();
  const model = useLoadedModel('building');

  useEffect(() => {
    if (model) {
      fitToModel(model.object, 1.5);
    }
  }, [model]);

  return null;
}
```

## 구조

```
engine/
├── index.ts              # Public exports
├── types.ts              # TypeScript types
├── camera/
│   ├── index.ts
│   └── CameraControls.tsx
├── loader/
│   ├── index.ts
│   ├── FbxLoader.tsx
│   └── GltfLoader.tsx
└── stores/
    ├── index.ts
    ├── modelStore.ts
    └── cameraStore.ts
```
