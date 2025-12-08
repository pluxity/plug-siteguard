export interface PTZCommand {
  pan: number; // -100 ~ 100 (left/right)
  tilt: number; // -100 ~ 100 (down/up)
  zoom: number; // -100 ~ 100 (out/in)
}

export interface PTZStatus {
  pan: number;
  tilt: number;
  zoom: number;
}

export interface PTZCamera {
  id: string;
  name: string;
  ip: string;
}

export type PTZDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'
  | 'home';
