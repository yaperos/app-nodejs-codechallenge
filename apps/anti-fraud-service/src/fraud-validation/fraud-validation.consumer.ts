import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka';
import {
  FraudValidationService,
  TransactionCreatedEvent,
} from './fraud-validation.service';

const KAFKA_TOPIC_TRANSACTION_CREATED = 'transaction-created';
const KAFKA_TOPIC_TRANSACTION_VALIDATED = 'transaction-validated';

@Injectable()
export class FraudValidationConsumer implements OnModuleInit {
  private readonly logger = new Logger(FraudValidationConsumer.name);

  constructor(
    private readonly kafka: KafkaService,
    private readonly fraudValidationService: FraudValidationService,
  ) {}

  async onModuleInit() {
    await this.kafka.subscribe(
      KAFKA_TOPIC_TRANSACTION_CREATED,
      async ({ message }) => {
        try {
          const transaction: TransactionCreatedEvent = JSON.parse(
            message.value?.toString() || '{}',
          );

          this.logger.log(
            `Received transaction to validate: ${transaction.transactionExternalId}`,
          );

          // Validate the transaction
          const validationResult =
            this.fraudValidationService.validate(transaction);

          // Publish validation result
          await this.kafka.produce(
            KAFKA_TOPIC_TRANSACTION_VALIDATED,
            validationResult,
          );

          this.logger.log(
            `Validation result published for transaction: ${transaction.transactionExternalId} - Status: ${validationResult.status}`,
          );
        } catch (error) {
          this.logger.error(
            `Error processing transaction: ${error.message}`,
            error.stack,
          );
        }
      },
    );

    this.logger.log(
      `Subscribed to Kafka topic: ${KAFKA_TOPIC_TRANSACTION_CREATED}`,
    );
  }
}
