export interface Envelope<T> {
  messageId: string;
  occurredAt: string;
  payload: T;
}