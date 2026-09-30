export interface DeadLetterMessage {
  originalTopic: string;
  consumerGroup: string;
  key: string | null;
  value: string;
  headers: Record<string, string>;
  error: { name: string; message: string };
  failedAt: string;
}