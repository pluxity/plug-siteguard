import { useState, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Save,
  Square,
  Trash2,
} from 'lucide-react';
import { usePTZ } from '@/lib/ptz';
import type { PTZDirection, PresetInfo } from '@/lib/ptz';
import { ptzApi } from '@/lib/ptz';

interface PTZControlsProps {
  cameraId: string;
  speed?: number;
}

export default function PTZControls({ cameraId, speed = 10 }: PTZControlsProps) {
  const { moveDirection, zoom, stop } = usePTZ(cameraId);
  const [selectedPreset, setSelectedPreset] = useState<number>(1);
  const [ptzSpeed, setPtzSpeed] = useState(speed);
  const [activeDirection, setActiveDirection] = useState<PTZDirection | 'zoom-in' | 'zoom-out' | null>(null);
  const [presets, setPresets] = useState<PresetInfo[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);

  const loadPresets = useCallback(async () => {
    setLoadingPresets(true);
    try {
      const presetList = await ptzApi.getPresets(cameraId);
      setPresets(presetList);
    } catch (err) {
      console.error('Failed to load presets:', err);
    } finally {
      setLoadingPresets(false);
    }
  }, [cameraId]);

  // Load presets on mount
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const getDirectionButtonClassName = (direction: PTZDirection | 'zoom-in' | 'zoom-out') => {
    const baseClasses = 'w-16 h-16 rounded-lg flex items-center justify-center text-white transition-colors';
    const activeClasses = 'bg-blue-600 ring-2 ring-blue-400';
    const inactiveClasses = 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500';

    if (activeDirection === direction) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  const getZoomButtonClassName = (direction: 'zoom-in' | 'zoom-out') => {
    const baseClasses = 'flex-1 py-2 rounded flex items-center justify-center gap-2 text-white transition-colors';
    const activeClasses = 'bg-blue-600 ring-2 ring-blue-400';
    const inactiveClasses = 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500';

    if (activeDirection === direction) {
      return `${baseClasses} ${activeClasses}`;
    }
    return `${baseClasses} ${inactiveClasses}`;
  };

  const handleMouseDown = (direction: PTZDirection) => {
    // 이미 활성화된 방향을 다시 누르면 Stop
    if (activeDirection === direction) {
      setActiveDirection(null);
      stop();
      return;
    }

    setActiveDirection(direction);
    moveDirection(direction, ptzSpeed);
  };

  const handleMouseUp = () => {
    // Intentionally not stopping PTZ movement (continuous mode)
  };

  const handleStop = () => {
    setActiveDirection(null);
    stop();
  };

  const handleZoomIn = () => {
    // 이미 줌인 중이면 Stop
    if (activeDirection === 'zoom-in') {
      setActiveDirection(null);
      stop();
      return;
    }

    setActiveDirection('zoom-in');
    zoom(ptzSpeed);
  };

  const handleZoomOut = () => {
    // 이미 줌아웃 중이면 Stop
    if (activeDirection === 'zoom-out') {
      setActiveDirection(null);
      stop();
      return;
    }

    setActiveDirection('zoom-out');
    zoom(-ptzSpeed);
  };

  const handleSavePreset = async () => {
    try {
      await ptzApi.savePreset(cameraId, selectedPreset);
      await loadPresets();
    } catch (err) {
      console.error('Failed to save preset:', err);
    }
  };

  const handleDeletePreset = async () => {
    try {
      await ptzApi.deletePreset(cameraId, selectedPreset);
      await loadPresets();
    } catch (err) {
      console.error('Failed to delete preset:', err);
    }
  };

  const handleGotoPreset = async (presetId: number) => {
    try {
      setSelectedPreset(presetId);
      await ptzApi.gotoPreset(cameraId, presetId);
    } catch (err) {
      console.error('Failed to go to preset:', err);
    }
  };

  // const handleFocus = (direction: 'near' | 'far') => {
  //   const speed = direction === 'near' ? -ptzSpeed : ptzSpeed;
  //   setActiveDirection(direction === 'near' ? 'focus-near' as any : 'focus-far' as any);
  //   ptzApi.focus(cameraId, speed);
  // };

  // const handleIris = (direction: 'close' | 'open') => {
  //   const speed = direction === 'close' ? -ptzSpeed : ptzSpeed;
  //   setActiveDirection(direction === 'close' ? 'iris-close' as any : 'iris-open' as any);
  //   ptzApi.iris(cameraId, speed);
  // };

  return (
    <div className="flex flex-col h-full gap-2 bg-gray-900 rounded-lg border border-gray-700 px-4 justify-center">
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
            className={getDirectionButtonClassName('up-left')}
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
            className={getDirectionButtonClassName('up')}
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
            className={getDirectionButtonClassName('up-right')}
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
            className={getDirectionButtonClassName('left')}
            title="Left"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={handleStop}
            className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-colors active:bg-red-400"
            title="Stop"
          >
            <Square size={24} fill="currentColor" />
          </button>

          <button
            onMouseDown={() => handleMouseDown('right')}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown('right')}
            onTouchEnd={handleMouseUp}
            className={getDirectionButtonClassName('right')}
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
            className={getDirectionButtonClassName('down-left')}
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
            className={getDirectionButtonClassName('down')}
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
            className={getDirectionButtonClassName('down-right')}
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
              className={getZoomButtonClassName('zoom-out')}
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
              className={getZoomButtonClassName('zoom-in')}
              title="Zoom In"
            >
              <ZoomIn size={16} />
              <span className="text-sm">확대</span>
            </button>
          </div>

          {/* Focus Controls */}
          {/* <div className="flex gap-2">
            <button
              onMouseDown={() => handleFocus('near')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleFocus('near')}
              onTouchEnd={handleMouseUp}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-white transition-colors ${
                activeDirection === 'focus-near'
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
              }`}
              title="Focus Near"
            >
              <Minus size={16} />
              <span className="text-sm">근접</span>
            </button>

            <button
              onMouseDown={() => handleFocus('far')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleFocus('far')}
              onTouchEnd={handleMouseUp}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-white transition-colors ${
                activeDirection === 'focus-far'
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
              }`}
              title="Focus Far"
            >
              <Plus size={16} />
              <span className="text-sm">원거리</span>
            </button>
          </div> */}

          {/* Iris Controls */}
          {/* <div className="flex gap-2">
            <button
              onMouseDown={() => handleIris('close')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleIris('close')}
              onTouchEnd={handleMouseUp}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-white transition-colors ${
                activeDirection === 'iris-close'
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
              }`}
              title="Iris Close"
            >
              <Minus size={16} />
              <span className="text-sm">조리개 닫기</span>
            </button>

            <button
              onMouseDown={() => handleIris('open')}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={() => handleIris('open')}
              onTouchEnd={handleMouseUp}
              className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-white transition-colors ${
                activeDirection === 'iris-open'
                  ? 'bg-blue-600 ring-2 ring-blue-400'
                  : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
              }`}
              title="Iris Open"
            >
              <Plus size={16} />
              <span className="text-sm">조리개 열기</span>
            </button>
          </div> */}

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
              step="5"
              value={ptzSpeed}
              onChange={(e) => setPtzSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>느림</span>
              <span>빠름</span>
            </div>
          </div>
        </div>

      {/* Preset Section */}
      <div className="border-t border-gray-700 pt-3">
        <div className="text-sm font-medium text-white mb-3">프리셋 관리</div>
        <div className="flex flex-col gap-3">
          {/* Preset Selector */}
          <div>
            <input
              type="number"
              min="1"
              max="300"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Preset Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSavePreset}
              className="py-2.5 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center gap-1 text-white transition-colors active:bg-green-400"
              title="현재 위치를 프리셋으로 저장"
            >
              <Save size={14} />
              <span className="text-xs font-medium">저장</span>
            </button>

            <button
              onClick={handleDeletePreset}
              className="py-2.5 bg-red-600 hover:bg-red-500 rounded flex items-center justify-center gap-1 text-white transition-colors active:bg-red-400"
              title="프리셋 삭제"
            >
              <Trash2 size={14} />
              <span className="text-xs font-medium">삭제</span>
            </button>
          </div>

          {/* Saved Presets List */}
          <div>
            <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
              <span>저장된 프리셋</span>
              {loadingPresets && <span className="text-blue-400">로딩 중...</span>}
            </div>
            {presets.length > 0 ? (
              <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleGotoPreset(preset.id)}
                    className="py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs transition-colors active:bg-gray-500"
                    title={preset.name || `Preset ${preset.id}`}
                  >
                    {preset.id}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-3 bg-gray-800 rounded">
                저장된 프리셋이 없습니다
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
