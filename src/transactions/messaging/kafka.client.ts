import { Kafka, logLevel } from "kafkajs";

export type KafkaClientConfig = {
  clientId: string;
  brokers: string[];
};

const clients = new Map<string, Kafka>();

export const getKafkaClient = (config: KafkaClientConfig): Kafka => {
  const key = `${config.clientId}-${config.brokers.join(",")}`;

  if (!clients.has(key)) {
    clients.set(
      key,
      new Kafka({
        clientId: config.clientId,
        brokers: config.brokers,
        logLevel: logLevel.ERROR
      })
    );
  }

  return clients.get(key)!;
};
