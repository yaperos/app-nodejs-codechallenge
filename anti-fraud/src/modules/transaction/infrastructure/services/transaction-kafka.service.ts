import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';

import { AppService } from '../../../../app.service';
import { KafkaService } from '../../../../modules/kafka/kafka.service';

@Injectable()
export class TransactionKafkaService {
  constructor(private readonly kafkaService: KafkaService) {
    this.kafkaService.subscribeToTopic(
      AppService.kafka_topic,
      this.receiveResult.bind(this),
    );
  }

  async sentStatus(transactionId: string, status: string) {
    await this.kafkaService.sendMessage(AppService.kafka_topic_status, {
      transactionId,
      status,
    });
  }

  async receiveResult(message: KafkaMessage) {
    try {
      const dataStr = message.value.toString();
      const dataJson = JSON.parse(dataStr);
      const { transactionId, value } = dataJson;

      console.log('DATA RECEIVED');
      console.log('transactionId', transactionId);
      console.log('value', value);
      console.log('status to sent', this.getStatus(value));

      await this.sentStatus(transactionId, this.getStatus(value));
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  getStatus(value: number) {
    return value <= AppService.value_max ? 'APPROVED' : 'REJECTED';
  }
}
