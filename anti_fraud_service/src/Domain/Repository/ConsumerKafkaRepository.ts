import { ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export interface ConsumerKafkaInterfaceRepository {
  consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig);
}
