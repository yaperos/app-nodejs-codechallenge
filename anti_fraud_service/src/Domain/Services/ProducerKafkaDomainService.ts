import { Inject } from '@nestjs/common';
import { ProducerKafkaInterfaceRepository } from '../Repository';
import { ProducerRecord } from 'kafkajs';

export class ProducerKafkaDomainService {
  constructor(
    @Inject('ProducerKafkaInterfaceRepository')
    private readonly producerKafkaInterfaceRepository: ProducerKafkaInterfaceRepository,
  ) {}

  async sendMessage(record: ProducerRecord): Promise<object> {
    return this.producerKafkaInterfaceRepository.sendMessage(record);
  }
}
