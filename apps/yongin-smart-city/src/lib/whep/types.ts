/**
 * WHEP 연결 상태
 */
export type WHEPStatus = 'idle' | 'connecting' | 'connected' | 'error';

/**
 * CCTV 정보
 */
export interface CCTVInfo {
  id: string;
  name: string;
}

/**
 * WHEP 협상 결과
 */
export interface WHEPNegotiationResult {
  answerSdp: string;
}

/**
 * useWHEPStream 훅 반환 타입
 */
export interface UseWHEPStreamReturn {
  /** 연결 상태 */
  status: WHEPStatus;
  /** 에러 메시지 */
  error: string | null;
  /** 비디오 요소 ref */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** 연결 */
  connect: () => void;
  /** 연결 해제 */
  disconnect: () => void;
}
