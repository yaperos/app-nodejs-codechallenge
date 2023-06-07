import { Consumer, KafkaMessage } from "kafkajs";

export type KafkaEvent = {
  topic: string;
  value: Record<string, unknown>;
};

export function getKafkaEvent(
  topic: string,
  message: KafkaMessage
): KafkaEvent {
  return {
    topic: topic,
    value: JSON.parse(message?.value?.toString() || "{}"),
  };
}

export function configureGacefullyShutdown(consumer: Consumer) {
  process.once("SIGINT", async () => {
    await consumer.disconnect();
    process.exit(0);
  });
  process.once("SIGTERM", async () => {
    await consumer.disconnect();
  });
}
