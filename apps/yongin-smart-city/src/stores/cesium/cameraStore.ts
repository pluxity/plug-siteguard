import { create } from 'zustand';
import {
  Viewer as CesiumViewer,
  Cartesian3,
  Math as CesiumMath,
  HeadingPitchRange,
  BoundingSphere,
} from 'cesium';
import type { CameraPosition } from './types';

interface CameraActions {
  flyTo: (viewer: CesiumViewer, position: CameraPosition) => void;
  setView: (viewer: CesiumViewer, position: CameraPosition) => void;
  focusOn: (viewer: CesiumViewer, lon: number, lat: number, distance?: number) => void;
}

export const useCameraStore = create<CameraActions>(() => ({
  flyTo: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    });
  },

  setView: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    });
  },

  focusOn: (viewer: CesiumViewer, lon: number, lat: number, distance: number = 1500) => {
    const targetPosition = Cartesian3.fromDegrees(lon, lat, 0);
    const offset = new HeadingPitchRange(
      CesiumMath.toRadians(0),
      CesiumMath.toRadians(-45),
      distance
    );
    viewer.camera.flyToBoundingSphere(new BoundingSphere(targetPosition, 0), {
      offset,
      duration: 1.0,
    });
  },
}));

