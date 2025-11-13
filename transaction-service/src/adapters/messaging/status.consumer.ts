import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { KafkaFactory } from './kafka.factory';
import { SchemaRegistryService } from './schema-registry.service';
import { TRANSACTIONS_STATUS_CHANGED_TOPIC } from './constants';
import { UpdateTransactionStatusService } from '@application/services/update-transaction-status.service';
import {
  TransactionStatus,
  TransactionStatusChangedEvent,
} from '@domain/transaction';

interface TransactionStatusChangedPayload {
  transactionExternalId: string;
  status: TransactionStatus;
  reason?: string | null;
  evaluatedAt: number;
}

@Injectable()
export class StatusChangedConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(StatusChangedConsumer.name);
  private consumer!: Consumer;

  constructor(
    private readonly kafkaFactory: KafkaFactory,
    private readonly schemaRegistry: SchemaRegistryService,
    private readonly updateTransactionStatusService: UpdateTransactionStatusService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.consumer = this.kafkaFactory.createConsumer();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: TRANSACTIONS_STATUS_CHANGED_TOPIC,
      fromBeginning: false,
    });

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
            await this.schemaRegistry.decode<TransactionStatusChangedPayload>(
              message.value,
            );

          const event: TransactionStatusChangedEvent = {
            transactionExternalId: payload.transactionExternalId,
            status: payload.status,
            reason: payload.reason ?? null,
            evaluatedAt: new Date(payload.evaluatedAt),
          };

          await this.updateTransactionStatusService.handle(event);
        } catch (error) {
          this.logger.error('Failed to process status change message', error as Error);
        }
      },
    });

    this.logger.log('StatusChangedConsumer running');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
