import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants/error-messages.constants';
import { TransactionDto } from 'src/dtos/transaction.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private clientKafka: ClientKafka,
    @Inject(forwardRef(() => TransactionsService))
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

  async handleTransactionStatusUpdated(transaction: TransactionDto) {
    try {
      if (!this.isValidTransaction(transaction)) {
        throw new Error(ERROR_MESSAGES.InvalidTransactionPayload);
      }
      await this.transactionsService.updateTransactionStatus(transaction);
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
      typeof transaction.value === 'number' &&
      typeof transaction.status === 'string'
    );
  }

  public async produce(topic: string, message: any): Promise<void> {
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
