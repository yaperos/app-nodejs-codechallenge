import { OnEvent } from '@nestjs/event-emitter';

export const TOPICS: Map<string, {}> = new Map([]);

export function Subscribe(topic: string) {
  TOPICS.set(topic, {});
  return OnEvent(topic);
}


