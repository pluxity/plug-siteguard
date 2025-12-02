import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraStore } from '../stores';
import { MouseButton } from '../types';

interface CameraControlsProps {
  enabled?: boolean;
  rotateButton?: MouseButton;
  panButton?: MouseButton;
  dragZoomButton?: MouseButton;
  rotateSmoothingFactor?: number;
  panSmoothingFactor?: number;
  zoomSpeed?: number;
  showPivot?: boolean;
}

export function CameraControls({
  enabled = true,
  rotateButton = MouseButton.Left,
  panButton = MouseButton.Right,
  dragZoomButton = MouseButton.Middle,
  rotateSmoothingFactor = 0.6,
  panSmoothingFactor = 0.7,
  zoomSpeed = 1.0,
  showPivot = true,
}: CameraControlsProps) {
  const { camera, gl, scene } = useThree();

  const pickPoint = useRef(new THREE.Vector3());
  const rotateDelta = useRef(new THREE.Vector2());
  const panDelta = useRef(new THREE.Vector3());
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const screenPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const mouseDownPos = useRef({
    rotate: new THREE.Vector2(),
    pan: new THREE.Vector2(),
    dragZoom: new THREE.Vector2(),
  });

  const mouseBtnState = useRef({
    rotate: false,
    pan: false,
    dragZoom: false,
  });

  const cursorRef = useRef<THREE.Mesh | null>(null);
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (showPivot) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cursor = new THREE.Mesh(geometry, material);
      cursor.visible = false;
      scene.add(cursor);
      cursorRef.current = cursor;

      return () => {
        scene.remove(cursor);
        geometry.dispose();
        material.dispose();
      };
    }
  }, [scene, showPivot]);

  const getPickPoint = useCallback(
    (screenPos: THREE.Vector2, plane?: THREE.Plane): THREE.Vector3 | undefined => {
      const rect = gl.domElement.getBoundingClientRect();
      const mousePos = new THREE.Vector2(
        (screenPos.x / rect.width) * 2 - 1,
        -(screenPos.y / rect.height) * 2 + 1
      );

      raycaster.current.setFromCamera(mousePos, camera);

      if (plane) {
        const point = new THREE.Vector3();
        if (raycaster.current.ray.intersectPlane(plane, point)) {
          return point;
        }
        return undefined;
      }

      const intersects = raycaster.current.intersectObjects(scene.children, true);
      const meshIntersect = intersects.find(
        (i) => i.object instanceof THREE.Mesh && i.object.visible && i.object !== cursorRef.current
      );

      if (meshIntersect) {
        return meshIntersect.point.clone();
      }

      const point = new THREE.Vector3();
      if (raycaster.current.ray.intersectPlane(groundPlane.current, point)) {
        return point.clone();
      }

      return undefined;
    },
    [camera, gl, scene]
  );

  const setCursorPosition = useCallback((pos: THREE.Vector3, visible: boolean) => {
    if (cursorRef.current) {
      cursorRef.current.position.copy(pos);
      cursorRef.current.visible = visible;
    }
  }, []);

  const onPointerDown = useCallback(
    (evt: PointerEvent) => {
      if (!enabled) return;

      const rect = gl.domElement.getBoundingClientRect();
      const offsetX = evt.clientX - rect.left;
      const offsetY = evt.clientY - rect.top;
      const screenPos = new THREE.Vector2(offsetX, offsetY);

      if (evt.button === rotateButton) {
        mouseDownPos.current.rotate.copy(screenPos);

        const pickPos = getPickPoint(screenPos);
        if (pickPos) {
          pickPoint.current.copy(pickPos);
          setCursorPosition(pickPos, true);
        } else {
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          const targetPos = camera.position.clone().addScaledVector(direction, 50.0);
          pickPoint.current.copy(targetPos);
          setCursorPosition(targetPos, true);
        }

        mouseBtnState.current.rotate = true;
      } else if (evt.button === panButton) {
        mouseDownPos.current.pan.copy(screenPos);

        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        cameraDirection.negate();

        const pickPos = getPickPoint(screenPos);
        if (pickPos) {
          groundPlane.current.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), pickPos);
          screenPlane.current.setFromNormalAndCoplanarPoint(cameraDirection, pickPos);
          setCursorPosition(pickPos, true);
        } else {
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          const targetPos = camera.position.clone().addScaledVector(direction, 50.0);
          groundPlane.current.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), targetPos);
          screenPlane.current.setFromNormalAndCoplanarPoint(cameraDirection, targetPos);
          setCursorPosition(targetPos, true);
        }

        mouseBtnState.current.pan = true;
      } else if (evt.button === dragZoomButton) {
        mouseDownPos.current.dragZoom.copy(screenPos);

        const pickPos = getPickPoint(screenPos);
        if (pickPos) {
          pickPoint.current.copy(pickPos);
          setCursorPosition(pickPos, true);
        }

        mouseBtnState.current.dragZoom = true;
      }
    },
    [enabled, rotateButton, panButton, dragZoomButton, camera, gl, getPickPoint, setCursorPosition]
  );

  const onPointerMove = useCallback(
    (evt: PointerEvent) => {
      if (!enabled) return;

      const rect = gl.domElement.getBoundingClientRect();
      const offsetX = evt.clientX - rect.left;
      const offsetY = evt.clientY - rect.top;
      const currPos = new THREE.Vector2(offsetX, offsetY);

      if (mouseBtnState.current.rotate) {
        const prevPos = mouseDownPos.current.rotate.clone();
        const offset = new THREE.Vector2().subVectors(currPos, prevPos);
        const delta = new THREE.Vector2(
          -(2 * Math.PI * offset.x) / rect.height,
          -(2 * Math.PI * offset.y) / rect.height
        );

        rotateDelta.current.x += delta.x * 0.5;
        rotateDelta.current.y += delta.y * 0.5;

        mouseDownPos.current.rotate.copy(currPos);
      } else if (mouseBtnState.current.pan) {
        const plane = evt.shiftKey ? screenPlane.current : groundPlane.current;

        const prevPos = getPickPoint(mouseDownPos.current.pan, plane);
        const currPickPos = getPickPoint(currPos, plane);

        if (prevPos && currPickPos) {
          const offset = new THREE.Vector3().subVectors(prevPos, currPickPos);
          panDelta.current.add(offset);
        }

        mouseDownPos.current.pan.copy(currPos);
      } else if (mouseBtnState.current.dragZoom) {
        const dirToPick = cursorRef.current?.position.clone().sub(camera.position).normalize();
        if (!dirToPick) return;

        let distance = cursorRef.current?.position.distanceTo(camera.position) ?? 1;
        if (distance <= 0.1) distance = 1.0;

        const zoomDirection = currPos.y > mouseDownPos.current.dragZoom.y ? -1.0 : 1.0;

        const camPos = camera.position
          .clone()
          .addScaledVector(dirToPick, distance * 0.1 * zoomSpeed * zoomDirection);
        camera.position.copy(camPos);

        if (camera instanceof THREE.OrthographicCamera) {
          camera.zoom += camera.zoom * 0.1 * zoomSpeed * zoomDirection;
          camera.updateProjectionMatrix();
        }

        mouseDownPos.current.dragZoom.copy(currPos);
      }
    },
    [enabled, camera, gl, getPickPoint, zoomSpeed]
  );

  const onPointerUp = useCallback(
    (evt: PointerEvent) => {
      if (evt.button === rotateButton) {
        mouseBtnState.current.rotate = false;
      } else if (evt.button === panButton) {
        mouseBtnState.current.pan = false;
      } else if (evt.button === dragZoomButton) {
        mouseBtnState.current.dragZoom = false;
      }

      setCursorPosition(new THREE.Vector3(), false);
    },
    [rotateButton, panButton, dragZoomButton, setCursorPosition]
  );

  const onMouseWheel = useCallback(
    (evt: WheelEvent) => {
      if (!enabled) return;

      evt.preventDefault();

      const zoomDirection = evt.deltaY < 0 ? 1.0 : -1.0;

      const rect = gl.domElement.getBoundingClientRect();
      const offsetX = evt.clientX - rect.left;
      const offsetY = evt.clientY - rect.top;
      const screenPos = new THREE.Vector2(offsetX, offsetY);

      const pickPos = getPickPoint(screenPos);
      if (pickPos) {
        const dirToPick = pickPos.clone().sub(camera.position).normalize();
        let distance = pickPos.distanceTo(camera.position);
        if (distance <= 0.1) distance = 1.0;

        const camPos = camera.position
          .clone()
          .addScaledVector(dirToPick, distance * 0.1 * zoomSpeed * zoomDirection);
        camera.position.copy(camPos);
      } else {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);

        const camPos = camera.position.clone().addScaledVector(forward, 1.0 * zoomDirection);
        camera.position.copy(camPos);
      }

      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom += camera.zoom * 0.1 * zoomSpeed * zoomDirection;
        camera.updateProjectionMatrix();
      }
    },
    [enabled, camera, gl, getPickPoint, zoomSpeed]
  );

  const onContextMenu = useCallback((evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
  }, []);

  useEffect(() => {
    const dom = gl.domElement;

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onMouseWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onMouseWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp, onMouseWheel, onContextMenu]);

  useFrame(() => {
    if (!enabled) return;

    const dirCamLook = new THREE.Vector3(0, 0, -1);
    dirCamLook.applyQuaternion(camera.quaternion);

    const angleUp = dirCamLook.angleTo(new THREE.Vector3(0, 1, 0));
    if (angleUp - rotateDelta.current.y < Math.PI * 0.01 || Math.PI < angleUp - rotateDelta.current.y) {
      rotateDelta.current.y = 0.0;
    }

    const dirToCamWithForce = camera.position.clone().sub(pickPoint.current);

    const matRotHorizontal = new THREE.Matrix4();
    matRotHorizontal.makeRotationAxis(new THREE.Vector3(0, 1, 0), rotateDelta.current.x);

    const camRight = new THREE.Vector3(1, 0, 0);
    camRight.applyQuaternion(camera.quaternion);

    const matRotVertical = new THREE.Matrix4();
    matRotVertical.makeRotationAxis(camRight, rotateDelta.current.y);

    const matCombine = new THREE.Matrix4().multiplyMatrices(matRotHorizontal, matRotVertical);
    dirToCamWithForce.applyMatrix4(matCombine);

    camera.position.copy(pickPoint.current).add(dirToCamWithForce);

    dirCamLook.applyMatrix4(matCombine);
    dirCamLook.add(camera.position);
    camera.lookAt(dirCamLook);

    rotateDelta.current.x *= rotateSmoothingFactor;
    rotateDelta.current.y *= rotateSmoothingFactor;

    const matTranslate = new THREE.Matrix4().makeTranslation(
      panDelta.current.x,
      panDelta.current.y,
      panDelta.current.z
    );
    camera.position.applyMatrix4(matTranslate);
    panDelta.current.multiplyScalar(panSmoothingFactor);
  });

  return null;
}

export function useFitToModel() {
  const { camera } = useThree();
  const setOrbitTarget = useCameraStore((state) => state.setOrbitTarget);

  const fitToModel = useCallback(
    (object: THREE.Object3D, padding = 1.5) => {
      const box = new THREE.Box3().setFromObject(object);
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);

      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      const camPos = sphere.center.clone().addScaledVector(direction, -sphere.radius * padding);
      camera.position.copy(camPos);
      camera.lookAt(sphere.center);

      setOrbitTarget(sphere.center);
    },
    [camera, setOrbitTarget]
  );

  return { fitToModel };
}
