import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('TRANSACTIONS_STREAM') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendMessage(topic: string, message: any) {
    await this.kafkaClient.emit(topic, JSON.stringify(message));
  }
}
