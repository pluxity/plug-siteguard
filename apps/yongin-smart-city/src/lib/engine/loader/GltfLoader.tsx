import { useEffect, useCallback } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';
import { useModelStore } from '../stores';
import type { LoadedModel } from '../types';

let dracoLoader: DRACOLoader | null = null;

function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  }
  return dracoLoader;
}

export async function loadGLTF(
  url: string,
  options?: {
    onProgress?: (progress: { loaded: number; total: number; percent: number }) => void;
    castShadow?: boolean;
    receiveShadow?: boolean;
    envMapIntensity?: number;
    useDraco?: boolean;
  }
): Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    if (options?.useDraco !== false) {
      loader.setDRACOLoader(getDracoLoader());
    }

    loader.load(
      url,
      (gltf) => {
        const scene = gltf.scene;

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = options?.castShadow ?? true;
            child.receiveShadow = options?.receiveShadow ?? true;

            const envMapIntensity = options?.envMapIntensity ?? 0.1;
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  if ('envMapIntensity' in mat) {
                    mat.envMapIntensity = envMapIntensity;
                  }
                });
              } else if ('envMapIntensity' in child.material) {
                (child.material as THREE.MeshStandardMaterial).envMapIntensity = envMapIntensity;
              }
            }
          }
        });

        resolve({
          scene,
          animations: gltf.animations,
        });
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

export function useGLTFLoader() {
  const addModel = useModelStore((state) => state.addModel);
  const removeModel = useModelStore((state) => state.removeModel);
  const setLoadingStatus = useModelStore((state) => state.setLoadingStatus);
  const setLoadingProgress = useModelStore((state) => state.setLoadingProgress);

  const load = useCallback(
    async (id: string, url: string) => {
      setLoadingStatus(id, 'loading');
      setLoadingProgress(id, { loaded: 0, total: 100, percent: 0 });

      try {
        const { scene, animations } = await loadGLTF(url, {
          onProgress: (progress) => {
            setLoadingProgress(id, progress);
          },
        });

        const boundingBox = new THREE.Box3().setFromObject(scene);
        const center = boundingBox.getCenter(new THREE.Vector3());

        const type = url.toLowerCase().endsWith('.glb') ? 'glb' : 'gltf';

        const model: LoadedModel = {
          id,
          url,
          type,
          object: scene,
          animations,
          boundingBox,
          center,
        };

        addModel(model);
        setLoadingStatus(id, 'loaded');

        return model;
      } catch (error) {
        console.error('GLTF loading error:', error);
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

interface GLTFModelProps {
  id: string;
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  centerModel?: boolean;
  onLoad?: (model: LoadedModel) => void;
  onError?: (error: Error) => void;
}

export function GLTFModel({
  id,
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  centerModel = true,
  onLoad,
  onError,
}: GLTFModelProps) {
  const { load, unload } = useGLTFLoader();
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

export function useGLTFAnimation(modelId: string) {
  const model = useModelStore((state) => state.models.get(modelId));
  const mixerRef = { current: null as THREE.AnimationMixer | null };
  const actionsRef = { current: new Map<string, THREE.AnimationAction>() };

  useEffect(() => {
    if (!model || !model.animations || model.animations.length === 0) return;

    const mixer = new THREE.AnimationMixer(model.object);
    mixerRef.current = mixer;

    model.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      actionsRef.current.set(clip.name, action);
    });

    return () => {
      mixer.stopAllAction();
      actionsRef.current.clear();
    };
  }, [model]);

  const play = useCallback((name: string, options?: { loop?: boolean; clampWhenFinished?: boolean }) => {
    const action = actionsRef.current.get(name);
    if (action) {
      action.reset();
      action.setLoop(
        options?.loop ? THREE.LoopRepeat : THREE.LoopOnce,
        options?.loop ? Infinity : 1
      );
      action.clampWhenFinished = options?.clampWhenFinished ?? true;
      action.play();
    }
  }, []);

  const stop = useCallback((name: string) => {
    const action = actionsRef.current.get(name);
    if (action) {
      action.stop();
    }
  }, []);

  const stopAll = useCallback(() => {
    mixerRef.current?.stopAllAction();
  }, []);

  const getAnimationNames = useCallback(() => {
    return Array.from(actionsRef.current.keys());
  }, []);

  return { play, stop, stopAll, getAnimationNames, mixer: mixerRef.current };
}
