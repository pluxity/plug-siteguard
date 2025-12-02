import type { WHEPNegotiationResult } from './types';

/**
 * WHEP URL 생성
 * @param serverUrl WHEP 서버 URL (예: http://dev.pluxity.com:8889)
 * @param streamPath 스트림 경로 (예: "camera1")
 */
export function buildWhepUrl(serverUrl: string, streamPath: string): string {
  const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  return `${baseUrl}/${encodeURIComponent(streamPath)}/whep`;
}

/**
 * WHEP 협상 수행
 * SDP offer를 전송하고 answer를 받아 PeerConnection에 설정
 */
export async function performWhepNegotiation(
  pc: RTCPeerConnection,
  url: string,
  signal?: AbortSignal
): Promise<WHEPNegotiationResult> {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body: offer.sdp || '',
    signal,
  });

  if (!response.ok) {
    throw new Error(`WHEP negotiation failed: ${response.status} ${response.statusText}`);
  }

  const answerSdp = await response.text();
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

  return { answerSdp };
}

/**
 * 수신 전용 PeerConnection 생성
 */
export function createReceiverPeerConnection(
  onVideoStream: (stream: MediaStream) => void
): RTCPeerConnection {
  const pc = new RTCPeerConnection();

  pc.addEventListener('track', (event) => {
    if (event.track.kind === 'video' && event.streams[0]) {
      onVideoStream(event.streams[0]);
    }
  });

  pc.addTransceiver('video', { direction: 'recvonly' });
  pc.addTransceiver('audio', { direction: 'recvonly' });

  return pc;
}
