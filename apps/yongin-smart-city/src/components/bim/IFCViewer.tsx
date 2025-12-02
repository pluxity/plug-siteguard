import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as WebIFC from 'web-ifc';

interface IFCViewerProps {
  modelUrl: string;
  className?: string;
}

export function IFCViewer({ modelUrl, className = '' }: IFCViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ifcApiRef = useRef<WebIFC.IfcAPI | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let disposed = false;

    const init = async () => {
      try {
        // Scene 설정
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        sceneRef.current = scene;

        // Camera 설정
        const camera = new THREE.PerspectiveCamera(
          50,
          container.clientWidth / container.clientHeight,
          0.1,
          10000
        );
        camera.position.set(50, 50, 50);
        cameraRef.current = camera;

        // Renderer 설정
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls 설정
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = 0;
        controlsRef.current = controls;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight1.position.set(10, 10, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-10, -10, -5);
        scene.add(directionalLight2);

        // Grid
        const grid = new THREE.GridHelper(100, 100, 0x444444, 0x333333);
        scene.add(grid);

        // web-ifc 초기화
        const ifcApi = new WebIFC.IfcAPI();
        ifcApi.SetWasmPath('/wasm/');
        await ifcApi.Init();
        ifcApiRef.current = ifcApi;

        if (disposed) return;

        // IFC 파일 로드
        setLoading(true);
        setProgress(10);

        const response = await fetch(modelUrl);
        const data = await response.arrayBuffer();
        const buffer = new Uint8Array(data);

        if (disposed) return;
        setProgress(30);

        const modelID = ifcApi.OpenModel(buffer);
        setProgress(50);

        // 지오메트리 추출
        const modelGroup = new THREE.Group();
        const meshes = ifcApi.LoadAllGeometry(modelID);

        setProgress(70);

        for (let i = 0; i < meshes.size(); i++) {
          const mesh = meshes.get(i);
          const placedGeometries = mesh.geometries;

          for (let j = 0; j < placedGeometries.size(); j++) {
            const placedGeometry = placedGeometries.get(j);
            const geometry = ifcApi.GetGeometry(modelID, placedGeometry.geometryExpressID);

            const vertices = ifcApi.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
            const indices = ifcApi.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());

            if (vertices.length === 0 || indices.length === 0) continue;

            const bufferGeometry = new THREE.BufferGeometry();

            // Position attribute (x, y, z, nx, ny, nz per vertex = 6 floats)
            const positionData = new Float32Array(vertices.length / 2);
            const normalData = new Float32Array(vertices.length / 2);

            for (let k = 0; k < vertices.length; k += 6) {
              const idx = k / 6;
              positionData[idx * 3] = vertices[k];
              positionData[idx * 3 + 1] = vertices[k + 1];
              positionData[idx * 3 + 2] = vertices[k + 2];
              normalData[idx * 3] = vertices[k + 3];
              normalData[idx * 3 + 1] = vertices[k + 4];
              normalData[idx * 3 + 2] = vertices[k + 5];
            }

            bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positionData, 3));
            bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normalData, 3));
            bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

            // Color from IFC
            const color = placedGeometry.color;
            const material = new THREE.MeshPhongMaterial({
              color: new THREE.Color(color.x, color.y, color.z),
              opacity: color.w,
              transparent: color.w < 1,
              side: THREE.DoubleSide,
            });

            const threeMesh = new THREE.Mesh(bufferGeometry, material);

            // Apply transformation matrix
            const matrix = new THREE.Matrix4();
            matrix.fromArray(placedGeometry.flatTransformation);
            threeMesh.applyMatrix4(matrix);

            modelGroup.add(threeMesh);

            geometry.delete();
          }
        }

        ifcApi.CloseModel(modelID);

        setProgress(90);

        // 모델을 scene에 추가
        scene.add(modelGroup);

        // 모델 중심으로 카메라 조정
        const box = new THREE.Box3().setFromObject(modelGroup);
        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          // 모델을 원점으로 이동
          modelGroup.position.sub(center);

          // 카메라 위치 조정
          camera.position.set(maxDim, maxDim * 0.5, maxDim);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.update();
        }

        setProgress(100);
        setLoading(false);

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
          if (!container || !camera || !renderer) return;
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Double-click to set orbit center
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const handleDoubleClick = (event: MouseEvent) => {
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(scene.children, true);

          if (intersects.length > 0) {
            const point = intersects[0].point;
            controls.target.copy(point);
            controls.update();
          }
        };
        renderer.domElement.addEventListener('dblclick', handleDoubleClick);

        return () => {
          window.removeEventListener('resize', handleResize);
          renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
        };
      } catch (err) {
        console.error('IFC Loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load IFC');
        setLoading(false);
      }
    };

    init();

    return () => {
      disposed = true;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (ifcApiRef.current) {
        ifcApiRef.current = null;
      }
    };
  }, [modelUrl]);

  return (
    <div className={`relative w-full h-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">IFC 모델 로딩 중... {progress}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <span className="text-red-400 block mb-2">IFC 로드 실패</span>
            <span className="text-sm text-gray-500">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
