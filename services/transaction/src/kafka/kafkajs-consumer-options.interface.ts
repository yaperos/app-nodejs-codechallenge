import { ConsumerConfig, ConsumerSubscribeTopic } from "kafkajs";

export interface IKafkajsConsumerOptions {
  topic: ConsumerSubscribeTopic;
  config: ConsumerConfig;
  onMessage: (message: any) => Promise<void>;
}
