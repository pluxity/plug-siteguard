import { HeightReference, CustomDataSource } from 'cesium';

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
  dataSource?: CustomDataSource;
}


export const DEFAULT_CAMERA_POSITION: CameraPosition = {
  lon: 2.218407,
  lat: 0.650516,
  height: 600.93,
  heading: 3.50,
  pitch: -25.44,
  roll: 0,
};

