// src/kafka/kafka.service.ts
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/constants/kafka.constants';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ERROR_MESSAGES } from 'src/constants/error-messages.constants';
import { TransactionDto } from 'src/dto/transaction.dto';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private clientKafka: ClientKafka,
    private transactionsService: TransactionsService,
  ) {}

  async onModuleInit() {
    try {
      await this.clientKafka.connect();
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.KafkaConnection, error.stack);
      throw new Error(`${ERROR_MESSAGES.KafkaConnection}: ${error.message}`);
    }
  }

  async handleTransactionCreated(transaction: TransactionDto) {
    try {
      if (!this.isValidTransaction(transaction)) {
        throw new Error(ERROR_MESSAGES.InvalidTransactionPayload);
      }
      const status = this.transactionsService.validate(transaction);
      transaction = { ...transaction, status };
      await this.produceTransactionCreatedEvent(transaction);
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.KafkaHandleTransaction, error.stack);
      throw new Error(
        `${ERROR_MESSAGES.KafkaHandleTransaction}: ${error.message}`,
      );
    }
  }

  private isValidTransaction(transaction: TransactionDto): boolean {
    return (
      transaction &&
      typeof transaction.transactionExternalId === 'string' &&
      typeof transaction.value === 'number'
    );
  }

  private async produceTransactionCreatedEvent(
    transaction: TransactionDto,
  ): Promise<void> {
    for (let attempts = 0, delay = 5000; attempts < 5; attempts++) {
      try {
        await this.produce(
          KAFKA_TOPICS.TransactionStatusUpdated,
          JSON.stringify(transaction),
        );
        break;
      } catch (error) {
        this.logger.warn(
          ERROR_MESSAGES.KafkaProduceEventRetry(attempts + 1),
          error.message,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  private async produce(topic: string, message: any): Promise<void> {
    try {
      await lastValueFrom(this.clientKafka.emit(topic, message));
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.KafkaProduceMessage, error.stack);
      throw new Error(
        `${ERROR_MESSAGES.KafkaProduceMessage}: ${error.message}`,
      );
    }
  }
}
