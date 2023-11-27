import { Injectable } from '@nestjs/common';
import {
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  ProducerRecord,
} from 'kafkajs';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaProducerService } from './kafka-producer.service';

@Injectable()
export class KafkaService {
  constructor(
    private kafkaConsumerService: KafkaConsumerService,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  async consume(
    subscription: ConsumerSubscribeTopics,
    config?: ConsumerRunConfig,
  ) {
    return await this.kafkaConsumerService.consume(subscription, config);
  }

  async produce(record: ProducerRecord) {
    await this.kafkaProducerService.produce(record);
  }
}
