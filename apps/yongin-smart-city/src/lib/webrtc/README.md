# WebRTC CCTV 스트리밍 라이브러리

WebSocket 기반 WebRTC 시그널링을 통해 CCTV 스트림을 수신하고 관리하는 라이브러리입니다.

## 구조

```
lib/webrtc/
├── store.ts    # Zustand 스토어 (WebSocket, 스트림 상태 관리)
├── hooks.ts    # React 훅
├── types.ts    # 타입 정의
└── index.ts    # exports
```

## 초기화

App.tsx에서 앱 시작 시 초기화해야 합니다.

```tsx
import { useEffect } from 'react';
import { useWebRTCStore } from './lib/webrtc';

function App() {
  const initialized = useWebRTCStore((state) => state.initialized);
  const initialize = useWebRTCStore((state) => state.initialize);
  const cleanup = useWebRTCStore((state) => state.cleanup);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);

  if (!initialized) {
    return <div>연결 중...</div>;
  }

  return <RouterComponent />;
}
```

`initialize()`가 수행하는 작업:
1. WebSocket 서버에 연결
2. CCTV 목록 fetch

## Hooks

### useCCTVStream

단일 CCTV 스트림을 video 태그에 연결합니다.

```tsx
import { useCCTVStream } from './lib/webrtc';

function CCTVViewer({ streamId }: { streamId: string }) {
  const { videoRef, status, error } = useCCTVStream(streamId);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      {status === 'connecting' && <span>연결 중...</span>}
      {status === 'connected' && <span>연결됨</span>}
      {status === 'failed' && <span>실패: {error}</span>}
    </div>
  );
}
```

**Parameters:**
- `streamId: string` - CCTV 스트림 ID
- `autoConnect?: boolean` - 마운트 시 자동 연결 (기본값: true)

**Returns:**
- `videoRef` - video 태그에 연결할 ref
- `status` - 'idle' | 'connecting' | 'connected' | 'failed'
- `stream` - MediaStream 객체
- `error` - 에러 메시지
- `connect()` - 수동 연결
- `disconnect()` - 수동 연결 해제

### useCCTVList

CCTV 목록을 가져옵니다.

```tsx
import { useCCTVList } from './lib/webrtc';

function CCTVList() {
  const { cctvList, loading } = useCCTVList();

  if (loading) return <div>로딩 중...</div>;

  return (
    <ul>
      {cctvList.map((cctv) => (
        <li key={cctv.id}>{cctv.name}</li>
      ))}
    </ul>
  );
}
```

### useWebSocketStatus

WebSocket 연결 상태를 확인합니다.

```tsx
import { useWebSocketStatus } from './lib/webrtc';

function ConnectionStatus() {
  const { connected } = useWebSocketStatus();
  return <span>{connected ? '연결됨' : '연결 끊김'}</span>;
}
```

## Store 직접 사용

hooks 외에 store를 직접 사용할 수도 있습니다.

```tsx
import { useWebRTCStore } from './lib/webrtc';

// 상태 구독
const streams = useWebRTCStore((state) => state.streams);
const cctvList = useWebRTCStore((state) => state.cctvList);

// 액션 호출
const connectStream = useWebRTCStore.getState().connectStream;
const disconnectStream = useWebRTCStore.getState().disconnectStream;
```

## 타입

```ts
interface CCTVInfo {
  id: string;
  name: string;
  source: string;
}

type StreamStatus = 'idle' | 'connecting' | 'connected' | 'failed';

interface StreamState {
  streamId: string;
  status: StreamStatus;
  pc: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  iceCandidates: RTCIceCandidateInit[];
  error: string | null;
}
```

## 동작 방식

1. **초기화**: App 마운트 → `initialize()` → WebSocket 연결 + CCTV 목록 fetch
2. **스트림 연결**: `useCCTVStream` 또는 `connectStream()` 호출 → PeerConnection 생성 → Offer 전송 → Answer 수신 → ICE 교환 → 연결 완료
3. **스트림 유지**: 페이지 이동 시에도 스트림 연결 유지 (disconnect 호출 전까지)
4. **정리**: App 언마운트 → `cleanup()` → 모든 스트림 종료 + WebSocket 종료
