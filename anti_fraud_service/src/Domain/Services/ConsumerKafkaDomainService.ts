import { Inject } from '@nestjs/common';
import { ConsumerKafkaInterfaceRepository } from '../Repository';
import { ConsumerSubscribeTopics, ConsumerRunConfig } from 'kafkajs';

export class ConsumerDomainKafkaService {
  constructor(
    @Inject('ConsumerKafkaInterfaceRepository')
    private readonly consumerKafkaInterfaceRepository: ConsumerKafkaInterfaceRepository,
  ) {}

  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
  ): Promise<object> {
    return this.consumerKafkaInterfaceRepository.consume(topic, config);
  }
}
