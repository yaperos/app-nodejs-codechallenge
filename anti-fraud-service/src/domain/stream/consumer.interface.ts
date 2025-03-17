import { ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export interface IConsumer {
  consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ): Promise<void>;
}
