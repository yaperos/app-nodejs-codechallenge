import { KafkaConnection } from 'nestjs-kafkajs';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionCreated } from './events';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private readonly kafkaConnection: KafkaConnection) {}

  private isValidAmount(amount: number): boolean {
    return amount <= 1000;
  }

  validateTransaction(event: TransactionCreated) {
    const response = { id: event.id, status: 'approved' };

    if (!this.isValidAmount(event.amount)) {
      response.status = 'rejected';
    }

    this.logger.debug(
      'Emitting event "transaction.status.validated" with body',
      response,
    );

    return this.kafkaConnection.publish(
      'transaction.status.validated',
      response,
    );
  }
}
