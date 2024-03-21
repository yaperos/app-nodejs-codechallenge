import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Model } from 'mongoose';
import { TransactionUseCases } from 'src/transactions/application/useCases/TransactionUseCase';
import { TransactionDocument } from 'src/transactions/domain/entities/transaction';
import { TransactionSecondaryAdapter } from '../implements/TransactionSecondaryAdapter';

@Injectable()
export class TransactionConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly _useCases: TransactionUseCases;
  private transactionAdapter: Model<TransactionDocument>;
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<TransactionDocument>,
  ) {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['kafka:9092'],
    });
    this.transactionAdapter = transactionModel;
    const secondaryPort = new TransactionSecondaryAdapter(
      this.transactionAdapter,
    );
    this._useCases = new TransactionUseCases(secondaryPort);
    this.consumer = this.kafka.consumer({ groupId: 'transaction-group' });
  }

  async onModuleInit() {
    await this.connect();
    await this.subscribe();
    await this.run();
  }

  private async connect() {
    await this.consumer.connect();
  }

  private async subscribe() {
    await this.consumer.subscribe({ topic: 'transaction-status-updates' });
  }

  private async run() {
    await this.consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        if (message.value) {
          this._useCases.updateTransactionStatus(
            message.key.toString(),
            message.value.toString(),
          );
        }
      },
    });
  }
}
