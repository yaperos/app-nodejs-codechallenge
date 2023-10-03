import { Injectable } from '@nestjs/common';
import { kafka } from '@src/core/config/kafka.config';
import {
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Producer,
  ProducerRecord,
  RecordMetadata,
  Consumer,
} from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafkaInstance = kafka;

  public async createConsumer(
    config: ConsumerConfig,
    optionSubscribe: ConsumerSubscribeTopics,
  ) {
    const consumer = this.kafkaInstance.consumer(config);
    await consumer.connect();
    await consumer.subscribe(optionSubscribe);

    return consumer;
  }

  public async createProducer(
    record: ProducerRecord,
  ): Promise<RecordMetadata[]> {
    const producer = kafka.producer();
    await producer.connect();
    return producer.send(record);
  }

  public disconnect(option: Consumer | Producer) {
    return option && option.disconnect();
  }
}
