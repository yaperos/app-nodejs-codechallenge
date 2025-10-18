import type { Kafka, Producer, ProducerRecord } from "kafkajs";
import type { Logger } from "pino";

const producers = new Map<Kafka, Producer>();

const getKafkaProducer = async (kafka: Kafka): Promise<Producer> => {
  if (!producers.has(kafka)) {
    const instance = kafka.producer();
    await instance.connect();
    producers.set(kafka, instance);
  }

  return producers.get(kafka)!;
};

export const sendKafkaMessage = async (
  kafka: Kafka,
  record: ProducerRecord,
  logger?: Logger
) => {
  const instance = await getKafkaProducer(kafka);
  logger?.debug({ topic: record.topic }, "dispatching kafka message");
  await instance.send(record);
};

export const disconnectKafkaProducer = async (kafka?: Kafka) => {
  if (kafka) {
    const instance = producers.get(kafka);
    if (instance) {
      await instance.disconnect();
      producers.delete(kafka);
    }
    return;
  }

  const disconnects = Array.from(producers.values()).map(async (producer) => {
    await producer.disconnect();
  });

  await Promise.all(disconnects);
  producers.clear();
};
