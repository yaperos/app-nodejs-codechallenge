import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { TRANSACTIONS_CREATED_TOPIC } from './constants';
import { OnTransactionCreatedService } from '@application/services/on-transaction-created.service';
import { TransactionCreatedEvent } from '@domain/events';

interface TransactionCreatedPayload {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: number;
}

@Injectable()
export class TransactionsCreatedConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(TransactionsCreatedConsumer.name);
  private consumer!: Consumer;

  constructor(
    private readonly kafkaFactory: KafkaFactory,
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly onTransactionCreated: OnTransactionCreatedService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.consumer = this.kafkaFactory.createConsumer();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: TRANSACTIONS_CREATED_TOPIC, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message, partition, topic }) => {
        if (!message.value) {
          this.logger.warn(
            `Received empty message on ${topic}[${partition}] offset ${message.offset}`,
          );
          return;
        }

        try {
          const payload =
            await this.schemaRegistry.decode<TransactionCreatedPayload>(message.value);

          const event: TransactionCreatedEvent = {
            transactionExternalId: payload.transactionExternalId,
            accountExternalIdDebit: payload.accountExternalIdDebit,
            accountExternalIdCredit: payload.accountExternalIdCredit,
            transferTypeId: payload.transferTypeId,
            value: payload.value,
            createdAt: new Date(payload.createdAt),
          };

          await this.onTransactionCreated.handle(event);
        } catch (error) {
          this.logger.error('Failed to process transaction.created message', error as Error);
        }
      },
    });

    this.logger.log('TransactionsCreatedConsumer running');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
