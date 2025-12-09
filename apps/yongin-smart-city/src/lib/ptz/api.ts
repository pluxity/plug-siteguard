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

  async getPresets(cameraId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/presets`);
    if (!response.ok) {
      throw new Error('Failed to get PTZ presets');
    }
    const data = await response.json();
    return data.data || [];
  }

  async gotoPreset(cameraId: string, presetId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/presets/${presetId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to go to PTZ preset');
    }
  }

  async savePreset(cameraId: string, presetId: number, name?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/presets/${presetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(name ? { name } : {}),
    });

    if (!response.ok) {
      throw new Error('Failed to save PTZ preset');
    }
  }

  async deletePreset(cameraId: string, presetId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/presets/${presetId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete PTZ preset');
    }
  }

  async focus(cameraId: string, speed: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/focus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed }),
    });

    if (!response.ok) {
      throw new Error('Failed to adjust focus');
    }
  }

  async iris(cameraId: string, speed: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v3/ptz/${cameraId}/iris`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed }),
    });

    if (!response.ok) {
      throw new Error('Failed to adjust iris');
    }
  }
}

export const ptzApi = new PTZApi();
