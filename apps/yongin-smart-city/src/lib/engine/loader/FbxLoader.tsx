import { useEffect, useCallback } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { useModelStore } from '../stores';
import type { LoadedModel } from '../types';

export async function loadFBX(
  url: string,
  options?: {
    onProgress?: (progress: { loaded: number; total: number; percent: number }) => void;
    castShadow?: boolean;
    receiveShadow?: boolean;
    envMapIntensity?: number;
  }
): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();

    loader.load(
      url,
      (fbx) => {
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = options?.castShadow ?? true;
            child.receiveShadow = options?.receiveShadow ?? true;

            if (child.material && options?.envMapIntensity !== undefined) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if ('envMapIntensity' in mat) {
                    mat.envMapIntensity = options.envMapIntensity!;
                  }
                });
              } else if ('envMapIntensity' in child.material) {
                (child.material as THREE.MeshStandardMaterial).envMapIntensity =
                  options.envMapIntensity;
              }
            }
          }
        });

        resolve(fbx);
      },
      (progress) => {
        if (options?.onProgress && progress.total > 0) {
          options.onProgress({
            loaded: progress.loaded,
            total: progress.total,
            percent: Math.round((progress.loaded / progress.total) * 100),
          });
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function useFBXLoader() {
  const addModel = useModelStore((state) => state.addModel);
  const removeModel = useModelStore((state) => state.removeModel);
  const setLoadingStatus = useModelStore((state) => state.setLoadingStatus);
  const setLoadingProgress = useModelStore((state) => state.setLoadingProgress);

  const load = useCallback(
    async (id: string, url: string) => {
      setLoadingStatus(id, 'loading');
      setLoadingProgress(id, { loaded: 0, total: 100, percent: 0 });

      try {
        const fbx = await loadFBX(url, {
          onProgress: (progress) => {
            setLoadingProgress(id, progress);
          },
        });

        const boundingBox = new THREE.Box3().setFromObject(fbx);
        const center = boundingBox.getCenter(new THREE.Vector3());

        const model: LoadedModel = {
          id,
          url,
          type: 'fbx',
          object: fbx,
          animations: fbx.animations,
          boundingBox,
          center,
        };

        addModel(model);
        setLoadingStatus(id, 'loaded');

        return model;
      } catch (error) {
        console.error('FBX loading error:', error);
        setLoadingStatus(id, 'error');
        throw error;
      }
    },
    [addModel, setLoadingStatus, setLoadingProgress]
  );

  const unload = useCallback(
    (id: string) => {
      removeModel(id);
    },
    [removeModel]
  );

  return { load, unload };
}

interface FBXModelProps {
  id: string;
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  centerModel?: boolean;
  onLoad?: (model: LoadedModel) => void;
  onError?: (error: Error) => void;
}

export function FBXModel({
  id,
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  centerModel = true,
  onLoad,
  onError,
}: FBXModelProps) {
  const { load, unload } = useFBXLoader();
  const model = useModelStore((state) => state.models.get(id));

  useEffect(() => {
    load(id, url)
      .then((m) => {
        if (centerModel && m.center) {
          m.object.position.sub(m.center);
        }
        onLoad?.(m);
      })
      .catch((err) => {
        onError?.(err);
      });

    return () => {
      unload(id);
    };
  }, [id, url, centerModel, load, unload, onLoad, onError]);

  if (!model) return null;

  const scaleArray: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <primitive
      object={model.object}
      position={position}
      rotation={rotation}
      scale={scaleArray}
    />
  );
}
