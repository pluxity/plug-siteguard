import { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useFBX, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { CameraControls } from '@/lib/engine';

interface FloorConfig {
  id: string;
  name: string;
  url: string;
  visible: boolean;
}

interface MeshInfo {
  name: string;
  floorId: string;
  floorName: string;
  vertices: number;
  triangles: number;
  position: { x: number; y: number; z: number };
  mesh: THREE.Mesh;
}

interface FloorModelProps {
  config: FloorConfig;
  onHoverMesh?: (info: MeshInfo | null) => void;
  setOutline: (mesh: THREE.Mesh | null) => void;
}

function FloorModel({ config, onHoverMesh, setOutline }: FloorModelProps) {
  const fbx = useFBX(config.url);
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredMesh = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [fbx]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);

  useFrame(() => {
    if (!config.visible || !groupRef.current) return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(groupRef.current.children, true);

    const meshIntersect = intersects.find(
      (i) => i.object instanceof THREE.Mesh && i.object.visible
    );

    if (meshIntersect && meshIntersect.object instanceof THREE.Mesh) {
      const mesh = meshIntersect.object;

      if (hoveredMesh.current !== mesh) {
        hoveredMesh.current = mesh;
        setOutline(mesh);

        const geometry = mesh.geometry;

        onHoverMesh?.({
          name: mesh.name || 'Unnamed Mesh',
          floorId: config.id,
          floorName: config.name,
          vertices: geometry.attributes.position?.count || 0,
          triangles: geometry.index ? geometry.index.count / 3 : 0,
          position: {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
          },
          mesh,
        });
      }
    } else if (hoveredMesh.current) {
      hoveredMesh.current = null;
      setOutline(null);
      onHoverMesh?.(null);
    }
  });

  if (!config.visible) return null;

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}

interface MultiFloorSceneProps {
  floors: FloorConfig[];
  onHoverMesh?: (info: MeshInfo | null) => void;
}

function MultiFloorScene({ floors, onHoverMesh }: MultiFloorSceneProps) {
  const { scene, size } = useThree();
  const outlineRef = useRef<LineSegments2 | null>(null);

  const outlineMaterial = useRef(
    new LineMaterial({
      color: 0x00ff00,
      linewidth: 3,
      transparent: true,
      opacity: 0.9,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    })
  );

  useEffect(() => {
    outlineMaterial.current.resolution.set(size.width, size.height);
  }, [size]);

  const setOutline = useCallback((mesh: THREE.Mesh | null) => {
    if (outlineRef.current) {
      scene.remove(outlineRef.current);
      outlineRef.current.geometry.dispose();
      outlineRef.current = null;
    }

    if (mesh) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
      const positions = edges.attributes.position.array;

      const lineGeometry = new LineSegmentsGeometry();
      lineGeometry.setPositions(positions as Float32Array);

      const line = new LineSegments2(lineGeometry, outlineMaterial.current);
      line.computeLineDistances();

      mesh.updateWorldMatrix(true, false);
      line.applyMatrix4(mesh.matrixWorld);

      scene.add(line);
      outlineRef.current = line;
    }
  }, [scene]);

  useEffect(() => {
    return () => {
      if (outlineRef.current) {
        scene.remove(outlineRef.current);
        outlineRef.current.geometry.dispose();
      }
      outlineMaterial.current.dispose();
    };
  }, [scene]);

  return (
    <>
      <CameraControls />

      {/* 환경광 - 전체적인 밝기 */}
      <ambientLight intensity={0.3} />

      {/* 태양광 - 그림자 포함 */}
      <directionalLight
        position={[200, 300, 100]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={1000}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-bias={-0.0001}
      />

      {/* 보조 조명 - 그림자 부드럽게 */}
      <directionalLight
        position={[-100, 100, -100]}
        intensity={0.3}
      />

      {/* 바닥면 - 그림자 받기용 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      <Environment preset="city" />

      {floors.map((floor) => (
        <Suspense key={floor.id} fallback={null}>
          <FloorModel
            config={floor}
            onHoverMesh={onHoverMesh}
            setOutline={setOutline}
          />
        </Suspense>
      ))}
    </>
  );
}

interface MultiFBXViewerProps {
  basePath: string;
  files: Array<{ id: string; name: string; filename: string }>;
}

export function MultiFBXViewer({ basePath, files }: MultiFBXViewerProps) {
  const [floors, setFloors] = useState<FloorConfig[]>(() =>
    files.map((f) => ({
      id: f.id,
      name: f.name,
      url: `${basePath}/${f.filename}`,
      visible: true,
    }))
  );

  const [hoveredMesh, setHoveredMesh] = useState<MeshInfo | null>(null);

  const toggleFloor = (floorId: string) => {
    setFloors((prev) =>
      prev.map((f) => (f.id === floorId ? { ...f, visible: !f.visible } : f))
    );
  };

  const toggleAll = (visible: boolean) => {
    setFloors((prev) => prev.map((f) => ({ ...f, visible })));
  };

  const visibleCount = floors.filter((f) => f.visible).length;

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        camera={{ position: [100, 100, 100], fov: 45, near: 0.1, far: 100000 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a2e');
        }}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="rounded bg-black/70 px-4 py-2 text-white">
                Loading models...
              </div>
            </Html>
          }
        >
          <MultiFloorScene floors={floors} onHoverMesh={setHoveredMesh} />
        </Suspense>
      </Canvas>

      {/* Floor Control Panel */}
      <div className="absolute left-4 top-4 max-h-[80vh] overflow-y-auto rounded-lg bg-black/80 p-4 text-white">
        <div className="mb-3 flex items-center justify-between border-b border-gray-600 pb-2">
          <span className="font-bold">층별 보기</span>
          <span className="text-sm text-gray-400">
            {visibleCount}/{floors.length}
          </span>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            onClick={() => toggleAll(true)}
            className="rounded bg-blue-600 px-3 py-1 text-xs hover:bg-blue-700"
          >
            전체 표시
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="rounded bg-gray-600 px-3 py-1 text-xs hover:bg-gray-700"
          >
            전체 숨김
          </button>
        </div>

        <div className="space-y-1">
          {floors.map((floor) => (
            <label
              key={floor.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
            >
              <input
                type="checkbox"
                checked={floor.visible}
                onChange={() => toggleFloor(floor.id)}
                className="h-4 w-4 accent-green-500"
              />
              <span className={floor.visible ? 'text-white' : 'text-gray-500'}>
                {floor.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Mesh Info Panel */}
      {hoveredMesh && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-black/80 p-4 text-sm text-white">
          <div className="mb-2 border-b border-gray-600 pb-2 font-bold text-green-400">
            {hoveredMesh.floorName}
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-gray-400">Mesh: </span>
              {hoveredMesh.name}
            </div>
            <div>
              <span className="text-gray-400">Vertices: </span>
              {hoveredMesh.vertices.toLocaleString()}
            </div>
            <div>
              <span className="text-gray-400">Triangles: </span>
              {Math.floor(hoveredMesh.triangles).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const CHANGNYEONG_FLOORS = [
  { id: 'B1', name: 'B1 (지하1층)', filename: '-1_B1_창녕문화예술회관.fbx' },
  { id: 'F1', name: '1F (1층)', filename: '1_F1_창녕문화예술회관.fbx' },
  { id: 'FM1', name: 'M1 (중층)', filename: '2_FM1_창녕문화예술회관.fbx' },
  { id: 'F2', name: '2F (2층)', filename: '3_F2_창녕문화예술회관.fbx' },
  { id: 'F3', name: '3F (3층)', filename: '4_F3_창녕문화예술회관.fbx' },
  { id: 'F4', name: '4F (4층)', filename: '5_F4_창녕문화예술회관.fbx' },
  { id: 'ROOF', name: 'ROOF (옥상)', filename: '6_ROOF_창녕문화예술회관.fbx' },
];
