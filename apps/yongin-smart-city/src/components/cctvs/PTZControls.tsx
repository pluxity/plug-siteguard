import { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  ZoomIn,
  ZoomOut,
  Save,
  MapPin,
} from 'lucide-react';
import { usePTZ } from '@/lib/ptz';
import type { PTZDirection } from '@/lib/ptz';
import { ptzApi } from '@/lib/ptz';

interface PTZControlsProps {
  cameraId: string;
  speed?: number;
}

export default function PTZControls({ cameraId, speed = 40 }: PTZControlsProps) {
  const { status, moveDirection, zoom } = usePTZ(cameraId);
  const [selectedPreset, setSelectedPreset] = useState<number>(1);
  const [ptzSpeed, setPtzSpeed] = useState(speed);

  const handleMouseDown = (direction: PTZDirection) => {
    moveDirection(direction, ptzSpeed);
  };

  const handleMouseUp = () => {
    // Intentionally not stopping PTZ movement
  };

  const handleZoomIn = () => {
    zoom(ptzSpeed);
  };

  const handleZoomOut = () => {
    zoom(-ptzSpeed);
  };

  const handleSetPreset = async () => {
    try {
      await ptzApi.gotoPreset(cameraId, selectedPreset);
    } catch (err) {
      // Error handling
    }
  };

  const handleGotoPreset = async (presetId: number) => {
    try {
      await ptzApi.gotoPreset(cameraId, presetId);
    } catch (err) {
      // Error handling
    }
  };

  const handleGotoHome = async () => {
    try {
      await ptzApi.gotoPreset(cameraId, 34);
    } catch (err) {
      // Error handling
    }
  };

  return (
    <div className="flex flex-col h-full gap-16 bg-gray-900 rounded-lg border border-gray-700 px-4 justify-center">
      {/* PTZ Control Section */}
      <div className="flex flex-col gap-3">
        {/* PTZ Control Pad */}
        <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-2">
          <button
            onMouseDown={() => handleMouseDown('up-left')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('up-left')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Up-Left"
          >
            <div className="flex flex-col items-center justify-center -space-y-1">
              <ChevronLeft size={28} className="rotate-45" />
            </div>
          </button>

          <button
            onMouseDown={() => handleMouseDown('up')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('up')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Up"
          >
            <ChevronUp size={28} />
          </button>

          <button
            onMouseDown={() => handleMouseDown('up-right')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('up-right')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Up-Right"
          >
            <div className="flex flex-col items-center justify-center -space-y-1">
              <ChevronUp size={28} className="rotate-45" />
            </div>
          </button>

          <button
            onMouseDown={() => handleMouseDown('left')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('left')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Left"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onMouseDown={() => handleMouseDown('home')}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleMouseDown('home')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white transition-colors active:bg-blue-400"
            title="Home"
          >
            <Home size={24} />
          </button>

          <button
            onMouseDown={() => handleMouseDown('right')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('right')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Right"
          >
            <ChevronRight size={28} />
          </button>

          <button
            onMouseDown={() => handleMouseDown('down-left')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('down-left')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Down-Left"
          >
            <div className="flex flex-col items-center justify-center -space-y-1">
              <ChevronDown size={28} className="rotate-45" />
            </div>
          </button>

          <button
            onMouseDown={() => handleMouseDown('down')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('down')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Down"
          >
            <ChevronDown size={28} />
          </button>

          <button
            onMouseDown={() => handleMouseDown('down-right')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('down-right')}
            onTouchEnd={handleMouseUp}
            className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition-colors active:bg-gray-500"
            title="Down-Right"
          >
            <div className="flex flex-col items-center justify-center -space-y-1">
              <ChevronRight size={28} className="rotate-45" />
            </div>
          </button>
        </div>
      </div>

          {/* Zoom Controls */}
          <div className="flex gap-2">
            <button
              onMouseDown={handleZoomOut}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleZoomOut}
              onTouchEnd={handleMouseUp}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2 text-white transition-colors active:bg-gray-500"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
              <span className="text-sm">축소</span>
            </button>

            <button
              onMouseDown={handleZoomIn}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleZoomIn}
              onTouchEnd={handleMouseUp}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2 text-white transition-colors active:bg-gray-500"
              title="Zoom In"
            >
              <ZoomIn size={16} />
              <span className="text-sm">확대</span>
            </button>
          </div>

          {/* Home Position */}
          <button
            onClick={handleGotoHome}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-2 text-white transition-colors active:bg-blue-400"
          >
            <Home size={16} />
            <span className="text-sm font-medium">홈 포지션</span>
          </button>

          {/* Speed Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-gray-400">제어 속도</label>
              <span className="text-xs text-white font-mono">{ptzSpeed}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={ptzSpeed}
              onChange={(e) => setPtzSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>느림</span>
              <span>빠름</span>
            </div>
          </div>

          {/* Status Display */}
          {status && (
            <div className="bg-gray-800 rounded p-3 border border-gray-700">
              <div className="text-xs font-medium text-gray-400 mb-2">현재 위치</div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-gray-500 mb-1">Pan</div>
                  <div className="text-white font-mono text-base font-semibold">{status.pan}</div>
                  <div className="text-gray-600 text-xs mt-0.5">(-100 ~ 100)</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 mb-1">Tilt</div>
                  <div className="text-white font-mono text-base font-semibold">{status.tilt}</div>
                  <div className="text-gray-600 text-xs mt-0.5">(-100 ~ 100)</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 mb-1">Zoom</div>
                  <div className="text-white font-mono text-base font-semibold">{status.zoom}</div>
                  <div className="text-gray-600 text-xs mt-0.5">(-100 ~ 100)</div>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Preset Section */}
      <div className="border-t border-gray-700 pt-3">
        <div className="text-sm font-medium text-white mb-3">프리셋 관리</div>
        <div className="flex flex-col gap-3">
          {/* Preset Selector */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">프리셋 번호 (1-4)</label>
            <input
              type="number"
              min="1"
              max="44"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Preset Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSetPreset}
              className="py-2.5 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center gap-2 text-white transition-colors active:bg-green-400"
            >
              <Save size={16} />
              <span className="text-sm font-medium">저장</span>
            </button>

            <button
              onClick={() => handleGotoPreset(selectedPreset)}
              className="py-2.5 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-2 text-white transition-colors active:bg-blue-400"
            >
              <MapPin size={16} />
              <span className="text-sm font-medium">이동</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-xs text-gray-400 mb-2">빠른 프리셋</div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((presetId) => (
                <button
                  key={presetId}
                  onClick={() => handleGotoPreset(presetId)}
                  className="py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors active:bg-gray-500"
                >
                  {presetId}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
