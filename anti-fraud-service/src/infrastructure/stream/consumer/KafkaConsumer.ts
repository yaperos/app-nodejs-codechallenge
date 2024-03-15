import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'kafkajs';
import { IKafkaConsumer } from '../../../domain/stream/consumer/IKafkaConsumer';
import { ITransactionService } from '../../../application/services/ITransactionService';

@Injectable()
export class KafkaConsumer implements OnModuleDestroy, IKafkaConsumer {
  constructor(
    private readonly config: ConfigService,
    private readonly transactionService: ITransactionService,
    @Inject('KafkaConsumerClient') private readonly kafkaConsumer: Consumer,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  async startConsumer(): Promise<void> {
    try {
      await this.kafkaConsumer.subscribe({
        topic: this.config.get('TRANSACTION_TOPIC'),
      });

      await this.kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const data = JSON.parse(message.value.toString());
          Logger.log(
            `Kafka Consumer:: New transaction topic': ${topic}, partition: ${partition}, message: ${message.value.toString()}`,
          );
          await this.transactionService.evaluateTransaction(data);
        },
      });
    } catch (error) {
      Logger.error('Error evaluating new transaction');
    }
  }
}
