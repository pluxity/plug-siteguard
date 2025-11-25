export interface WebSocketMessage {
  type: string;
  streamId?: string;
  payload?: unknown;
}
