import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';
import type { CameraState, CameraControlsConfig } from '../types';

const DEFAULT_CAMERA_CONFIG: CameraControlsConfig = {
  rotateButton: 0,
  panButton: 2,
  zoomSpeed: 1.0,
  rotateSpeed: 1.0,
  panSpeed: 1.0,
  smoothingFactor: 0.6,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI / 2,
  minDistance: 1,
  maxDistance: 10000,
  enableDamping: true,
  dampingFactor: 0.05,
};

interface CameraStoreState {
  config: CameraControlsConfig;
  orbitTarget: THREE.Vector3;
  savedStates: Map<string, CameraState>;
}

interface CameraStoreActions {
  setConfig: (config: Partial<CameraControlsConfig>) => void;
  setOrbitTarget: (target: THREE.Vector3) => void;
  saveState: (name: string, state: CameraState) => void;
  loadState: (name: string) => CameraState | undefined;
  deleteState: (name: string) => void;
}

type CameraStore = CameraStoreState & CameraStoreActions;

export const useCameraStore = create<CameraStore>()(
  subscribeWithSelector((set, get) => ({
    config: { ...DEFAULT_CAMERA_CONFIG },
    orbitTarget: new THREE.Vector3(0, 0, 0),
    savedStates: new Map(),

    setConfig: (config) => {
      set((state) => ({
        config: { ...state.config, ...config },
      }));
    },

    setOrbitTarget: (target) => {
      set({ orbitTarget: target.clone() });
    },

    saveState: (name, state) => {
      set((s) => {
        const savedStates = new Map(s.savedStates);
        savedStates.set(name, state);
        return { savedStates };
      });
    },

    loadState: (name) => {
      return get().savedStates.get(name);
    },

    deleteState: (name) => {
      set((state) => {
        const savedStates = new Map(state.savedStates);
        savedStates.delete(name);
        return { savedStates };
      });
    },
  }))
);

export function useCameraConfig() {
  return useCameraStore((state) => state.config);
}

export function useOrbitTarget() {
  return useCameraStore((state) => state.orbitTarget);
}
