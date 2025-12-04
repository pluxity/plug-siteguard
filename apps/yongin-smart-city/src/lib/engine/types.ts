import * as THREE from 'three';

export interface Vector3Data {
  x: number;
  y: number;
  z: number;
}

export interface CameraState {
  position: Vector3Data;
  target: Vector3Data;
  zoom?: number;
}

export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export interface LoadedModel {
  id: string;
  url: string;
  type: 'fbx' | 'gltf' | 'glb';
  object: THREE.Object3D;
  animations?: THREE.AnimationClip[];
  boundingBox?: THREE.Box3;
  center?: THREE.Vector3;
}

export type LoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface LoadingProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface CameraControlsConfig {
  rotateButton: MouseButton;
  panButton: MouseButton;
  zoomSpeed: number;
  rotateSpeed: number;
  panSpeed: number;
  smoothingFactor: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
  enableDamping: boolean;
  dampingFactor: number;
}

export interface EngineConfig {
  camera: Partial<CameraControlsConfig>;
  shadows: boolean;
  antialias: boolean;
  envMapIntensity: number;
}
