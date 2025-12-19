import { Producer } from 'kafkajs';

export function parseKafkaMessage<T>(message: Buffer): T {
  return JSON.parse(message.toString()) as T;
}

export async function publishEvent(
  producer: Producer,
  topic: string,
  message: any,
  key: string,
) {
  await producer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(message),
      },
    ],
  });
}
