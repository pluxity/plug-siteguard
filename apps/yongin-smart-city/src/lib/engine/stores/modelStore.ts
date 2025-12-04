import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';
import type { LoadedModel, LoadingStatus, LoadingProgress } from '../types';

interface ModelState {
  models: Map<string, LoadedModel>;
  loadingStatus: Map<string, LoadingStatus>;
  loadingProgress: Map<string, LoadingProgress>;
}

interface ModelActions {
  addModel: (model: LoadedModel) => void;
  removeModel: (id: string) => void;
  getModel: (id: string) => LoadedModel | undefined;
  setLoadingStatus: (id: string, status: LoadingStatus) => void;
  setLoadingProgress: (id: string, progress: LoadingProgress) => void;
  clearModels: () => void;
}

type ModelStore = ModelState & ModelActions;

function disposeModel(model: LoadedModel) {
  model.object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else {
        child.material?.dispose();
      }
    }
  });
}

export const useModelStore = create<ModelStore>()(
  subscribeWithSelector((set, get) => ({
    models: new Map(),
    loadingStatus: new Map(),
    loadingProgress: new Map(),

    addModel: (model) => {
      set((state) => {
        const models = new Map(state.models);
        models.set(model.id, model);
        return { models };
      });
    },

    removeModel: (id) => {
      const model = get().models.get(id);
      if (model) {
        disposeModel(model);
      }

      set((state) => {
        const models = new Map(state.models);
        models.delete(id);
        const loadingStatus = new Map(state.loadingStatus);
        loadingStatus.delete(id);
        const loadingProgress = new Map(state.loadingProgress);
        loadingProgress.delete(id);
        return { models, loadingStatus, loadingProgress };
      });
    },

    getModel: (id) => {
      return get().models.get(id);
    },

    setLoadingStatus: (id, status) => {
      set((state) => {
        const loadingStatus = new Map(state.loadingStatus);
        loadingStatus.set(id, status);
        return { loadingStatus };
      });
    },

    setLoadingProgress: (id, progress) => {
      set((state) => {
        const loadingProgress = new Map(state.loadingProgress);
        loadingProgress.set(id, progress);
        return { loadingProgress };
      });
    },

    clearModels: () => {
      const { models } = get();
      models.forEach((model) => disposeModel(model));

      set({
        models: new Map(),
        loadingStatus: new Map(),
        loadingProgress: new Map(),
      });
    },
  }))
);

export function useModelLoadingStatus(id: string) {
  return useModelStore((state) => state.loadingStatus.get(id) ?? 'idle');
}

export function useModelLoadingProgress(id: string) {
  return useModelStore((state) => state.loadingProgress.get(id));
}

export function useLoadedModel(id: string) {
  return useModelStore((state) => state.models.get(id));
}

export function useModelIds() {
  return useModelStore((state) => Array.from(state.models.keys()));
}
