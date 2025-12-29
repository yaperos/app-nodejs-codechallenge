import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka';
import { TransactionsService } from './transactions.service';

const KAFKA_TOPIC_TRANSACTION_VALIDATED = 'transaction-validated';

interface TransactionValidatedEvent {
  transactionExternalId: string;
  status: 'approved' | 'rejected';
}

@Injectable()
export class TransactionsConsumer implements OnModuleInit {
  private readonly logger = new Logger(TransactionsConsumer.name);

  constructor(
    private readonly kafka: KafkaService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async onModuleInit() {
    await this.kafka.subscribe(
      KAFKA_TOPIC_TRANSACTION_VALIDATED,
      async ({ message }) => {
        try {
          const event: TransactionValidatedEvent = JSON.parse(
            message.value?.toString() || '{}',
          );

          this.logger.log(
            `Received validation event for transaction: ${event.transactionExternalId} - Status: ${event.status}`,
          );

          await this.transactionsService.updateStatus(
            event.transactionExternalId,
            event.status,
          );

          this.logger.log(
            `Transaction ${event.transactionExternalId} updated to ${event.status}`,
          );
        } catch (error) {
          this.logger.error(
            `Error processing validation event: ${error.message}`,
          );
        }
      },
    );

    this.logger.log(
      `Subscribed to Kafka topic: ${KAFKA_TOPIC_TRANSACTION_VALIDATED}`,
    );
  }
}
