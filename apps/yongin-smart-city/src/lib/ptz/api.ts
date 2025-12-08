import type { PTZCamera, PTZCommand } from './types';

const PTZ_API_URL = import.meta.env.VITE_MEDIA_API_URL || 'http://192.168.10.181:9997';

export class PTZApi {
  private baseUrl: string;

  constructor(baseUrl: string = PTZ_API_URL) {
    this.baseUrl = baseUrl;
  }

  async getCameras(): Promise<PTZCamera[]> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/cameras`);
    if (!response.ok) {
      throw new Error('Failed to fetch PTZ cameras');
    }
    return response.json();
  }

  async move(cameraId: string, command: PTZCommand): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error('Failed to move PTZ camera');
    }
  }

  async stop(cameraId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/stop`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to stop PTZ camera');
    }
  }

  async getPresets(cameraId: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/presets`);
    if (!response.ok) {
      throw new Error('Failed to get PTZ presets');
    }
    return response.json();
  }

  async gotoPreset(cameraId: string, presetId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/preset/${presetId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to go to PTZ preset');
    }
  }
}

export const ptzApi = new PTZApi();
