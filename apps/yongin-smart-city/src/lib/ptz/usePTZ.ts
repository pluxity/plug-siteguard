import { useCallback, useEffect, useRef, useState } from 'react';
import { ptzApi } from './api';
import type { PTZCommand, PTZDirection } from './types';

const DEFAULT_SPEED = 10;

export function usePTZ(cameraId: string) {
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moveTimeoutRef = useRef<number | null>(null);

  const move = useCallback(
    async (command: PTZCommand) => {
      if (!cameraId) return;

      try {
        setIsMoving(true);
        setError(null);
        await ptzApi.move(cameraId, command);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to move camera');
      }
    },
    [cameraId],
  );

  const stop = useCallback(async () => {
    if (!cameraId) return;

    try {
      await ptzApi.stop(cameraId);
      setIsMoving(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop camera');
    }
  }, [cameraId]);

  const moveDirection = useCallback(
    async (direction: PTZDirection, speed = DEFAULT_SPEED) => {
      const commands: Record<PTZDirection, PTZCommand> = {
        up: { pan: 0, tilt: speed, zoom: 0 },
        down: { pan: 0, tilt: -speed, zoom: 0 },
        left: { pan: -speed, tilt: 0, zoom: 0 },
        right: { pan: speed, tilt: 0, zoom: 0 },
        'up-left': { pan: -speed, tilt: speed, zoom: 0 },
        'up-right': { pan: speed, tilt: speed, zoom: 0 },
        'down-left': { pan: -speed, tilt: -speed, zoom: 0 },
        'down-right': { pan: speed, tilt: -speed, zoom: 0 },
        home: { pan: 0, tilt: 0, zoom: 0 },
      };

      if (direction === 'home') {
        await ptzApi.gotoPreset(cameraId, 34);
      } else {
        await move(commands[direction]);
      }
    },
    [cameraId, move],
  );

  const zoom = useCallback(
    async (zoomSpeed: number) => {
      await move({ pan: 0, tilt: 0, zoom: zoomSpeed });
    },
    [move],
  );

  const startContinuousMove = useCallback(
    (direction: PTZDirection, speed = DEFAULT_SPEED) => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }

      moveDirection(direction, speed);
    },
    [moveDirection],
  );

  const stopContinuousMove = useCallback(() => {
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    stop();
  }, [stop]);

  useEffect(() => {
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isMoving,
    error,
    move,
    stop,
    moveDirection,
    zoom,
    startContinuousMove,
    stopContinuousMove,
  };
}
