export interface EventPublisher {
  publish(pattern: string, data: Record<string, unknown>): Promise<void>;
}
