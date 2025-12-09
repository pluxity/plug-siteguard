import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useFBX, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { CameraControls } from '@/lib/engine';

// 메시 정보 타입
interface MeshInfo {
  name: string;
  vertices: number;
  triangles: number;
  materialName: string;
  position: { x: number; y: number; z: number };
  mesh: THREE.Mesh; // Outline을 위한 mesh 참조
}

interface FBXModelProps {
  url: string;
  rotation?: [number, number, number];
  onHoverMesh?: (info: MeshInfo | null) => void;
}

function FBXModel({ url, rotation, onHoverMesh }: FBXModelProps) {
  const fbx = useFBX(url);
  const { camera, gl, scene, size } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hoveredMesh = useRef<THREE.Mesh | null>(null);
  const outlineRef = useRef<LineSegments2 | null>(null);
  const lastCameraPos = useRef(new THREE.Vector3());
  const lastCameraRot = useRef(new THREE.Euler());

  // Outline 머티리얼 (연두색, 두꺼운 선)
  const outlineMaterial = useRef(
    new LineMaterial({
      color: 0x00ff00,
      linewidth: 3, // 픽셀 단위 두께
      transparent: true,
      opacity: 0.9,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    })
  );

  // 해상도 업데이트
  useEffect(() => {
    outlineMaterial.current.resolution.set(size.width, size.height);
  }, [size]);

  // Outline 생성/제거
  const setOutline = (mesh: THREE.Mesh | null) => {
    // 기존 outline 제거
    if (outlineRef.current) {
      scene.remove(outlineRef.current);
      outlineRef.current.geometry.dispose();
      outlineRef.current = null;
    }

    // 새 outline 생성
    if (mesh) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 15);
      const positions = edges.attributes.position.array;

      // LineSegmentsGeometry로 변환
      const lineGeometry = new LineSegmentsGeometry();
      lineGeometry.setPositions(positions as Float32Array);

      const line = new LineSegments2(lineGeometry, outlineMaterial.current);
      line.computeLineDistances();

      // 메시의 월드 매트릭스 적용
      mesh.updateWorldMatrix(true, false);
      line.applyMatrix4(mesh.matrixWorld);

      scene.add(line);
      outlineRef.current = line;
    }
  };

  // 마우스 이벤트 핸들링
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);

  // 클린업
  useEffect(() => {
    return () => {
      if (outlineRef.current) {
        scene.remove(outlineRef.current);
        outlineRef.current.geometry.dispose();
      }
      outlineMaterial.current.dispose();
    };
  }, [scene]);

  // 매 프레임 Raycast 검사 및 카메라 변경 감지
  useFrame(() => {
    // 카메라 위치/회전 변경 감지
    const currentPos = camera.position;
    const currentRot = camera.rotation;

    if (!lastCameraPos.current.equals(currentPos) ||
        !lastCameraRot.current.equals(currentRot)) {
      console.log(`Camera position: (${currentPos.x.toFixed(2)}, ${currentPos.y.toFixed(2)}, ${currentPos.z.toFixed(2)})`);
      console.log(`Camera rotation (deg): (${(currentRot.x * 180 / Math.PI).toFixed(2)}°, ${(currentRot.y * 180 / Math.PI).toFixed(2)}°, ${(currentRot.z * 180 / Math.PI).toFixed(2)}°)`);

      lastCameraPos.current.copy(currentPos);
      lastCameraRot.current.copy(currentRot);
    }

    if (!fbx || !onHoverMesh) return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(fbx, true);

    const meshIntersect = intersects.find(
      (i) => i.object instanceof THREE.Mesh
    );

    if (meshIntersect && meshIntersect.object instanceof THREE.Mesh) {
      const mesh = meshIntersect.object;
      if (hoveredMesh.current !== mesh) {
        hoveredMesh.current = mesh;
        setOutline(mesh);

        const geometry = mesh.geometry;
        const vertices = geometry.attributes.position?.count || 0;
        const triangles = geometry.index
          ? geometry.index.count / 3
          : vertices / 3;

        const materialName = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.name || 'unnamed').join(', ')
          : mesh.material?.name || 'unnamed';

        onHoverMesh({
          name: mesh.name || '(unnamed)',
          vertices,
          triangles: Math.floor(triangles),
          materialName,
          position: {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
          },
          mesh,
        });
      }
    } else {
      if (hoveredMesh.current) {
        hoveredMesh.current = null;
        setOutline(null);
        onHoverMesh(null);
      }
    }
  });

  useEffect(() => {
    if (fbx) {
      // 모델의 바운딩 박스 계산
      const box = new THREE.Box3().setFromObject(fbx);
      const center = box.getCenter(new THREE.Vector3());

      // 모델을 중심으로 이동
      fbx.position.sub(center);

      // 카메라 위치 및 회전 설정
      camera.position.set(118.67, 182.73, 252.46);
      camera.rotation.set(
        -44.93 * Math.PI / 180,
        21.20 * Math.PI / 180,
        19.84 * Math.PI / 180
      );
      camera.updateProjectionMatrix();

      console.log(`Camera position: (${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)})`);
      console.log(`Camera rotation (deg): (${(camera.rotation.x * 180 / Math.PI).toFixed(2)}°, ${(camera.rotation.y * 180 / Math.PI).toFixed(2)}°, ${(camera.rotation.z * 180 / Math.PI).toFixed(2)}°)`);
    }
  }, [fbx, camera]);

  return <primitive object={fbx} rotation={rotation} />;
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">모델 로딩 중...</span>
      </div>
    </Html>
  );
}


interface FBXViewerProps {
  modelUrl: string;
  rotation?: [number, number, number];
  className?: string;
}

export function FBXViewer({ modelUrl, rotation, className = '' }: FBXViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredMesh, setHoveredMesh] = useState<MeshInfo | null>(null);

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50, near: 0.1, far: 100000 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a2e');
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <Suspense fallback={<LoadingSpinner />}>
          <FBXModel url={modelUrl} rotation={rotation} onHoverMesh={setHoveredMesh} />
          <Environment preset="city" />
        </Suspense>

        <CameraControls />
      </Canvas>

      {/* Hover 메시 정보 패널 */}
      {hoveredMesh && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white text-sm p-3 rounded-lg pointer-events-none">
          <div className="font-bold text-blue-400 mb-2">{hoveredMesh.name}</div>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Vertices:</span>{' '}
              {hoveredMesh.vertices.toLocaleString()}
            </div>
            <div>
              <span className="text-gray-400">Triangles:</span>{' '}
              {hoveredMesh.triangles.toLocaleString()}
            </div>
            <div>
              <span className="text-gray-400">Material:</span>{' '}
              {hoveredMesh.materialName}
            </div>
            <div>
              <span className="text-gray-400">Position:</span>{' '}
              ({hoveredMesh.position.x.toFixed(2)}, {hoveredMesh.position.y.toFixed(2)}, {hoveredMesh.position.z.toFixed(2)})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
