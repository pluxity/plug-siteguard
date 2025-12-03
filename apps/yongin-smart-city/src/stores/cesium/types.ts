import { HeightReference } from 'cesium';

export interface CameraPosition {
  lon: number;
  lat: number;
  height: number;
  heading?: number;
  pitch?: number;
  roll?: number;
}

export interface FeatureOptions {
  id: string;
  lon: number;
  lat: number;
  height?: number;
  heightReference?: HeightReference;
  image?: string;
  width?: number;
  heightValue?: number;
  label?: string;
  labelColor?: string;
  disableDepthTest?: boolean;
  disableScaleByDistance?: boolean;
}


export const DEFAULT_CAMERA_POSITION: CameraPosition = {
  lon: 127.1038,
  lat: 37.2842,
  height: 1000,
  heading: 0,
  pitch: -45,
  roll: 0,
};

