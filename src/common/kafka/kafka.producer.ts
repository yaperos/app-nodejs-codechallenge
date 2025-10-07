import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class KafkaProducerService {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendMessage(topic: string, message: object) {
    await this.kafkaService.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
