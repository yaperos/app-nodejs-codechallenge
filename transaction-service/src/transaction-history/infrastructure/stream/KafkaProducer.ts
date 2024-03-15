import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IKafkaProducer } from '../../domain/stream/IKafkaProducer';
import { Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleDestroy, IKafkaProducer {
  constructor(
    private readonly config: ConfigService,
    @Inject('KafkaProducerClient') private readonly kafkaProducer: Producer,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.kafkaProducer.disconnect();
  }

  async sendMessage(data: any): Promise<void> {
    Logger.log(
      `Sending new transaction with the following information': ${JSON.stringify(data)}`,
    );

    try {
      await this.kafkaProducer.send({
        topic: this.config.get('TRANSACTION_TOPIC'),
        messages: [
          {
            key: this.config.get('APP_NAME'),
            value: JSON.stringify(data),
          },
        ],
        timeout: this.config.get('KAFKA_TIMEOUT'),
      });
    } catch (error) {
      Logger.error('Error sending new transaction');
    }
  }
}
