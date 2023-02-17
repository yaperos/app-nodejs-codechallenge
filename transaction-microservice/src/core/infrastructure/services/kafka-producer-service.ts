import { Injectable } from '@nestjs/common';
import { KafkaService, KafkaPayload } from 'nestjs-kafka';

@Injectable()
export class KafkaProducerService {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendMessage(topic: string, message: any) {
    const payload: KafkaPayload = {
      messageId: '' + new Date().valueOf(),
      topicName: topic,
      messageType: 'json',
      body: JSON.stringify(message),
    };

    await this.kafkaService.sendMessage(topic, payload);
  }
}
