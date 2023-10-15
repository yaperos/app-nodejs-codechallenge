import { Injectable, Inject } from '@nestjs/common';
import { getTransactionStatus } from './utils';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionProcessedEvent } from './transaction-processed.event';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly antifraudClient: ClientKafka,
  ) {}
  handleTransactionCreated(transactionCreatedEvent) {
    const newStatus = getTransactionStatus(transactionCreatedEvent.amount);
    this.antifraudClient.emit(
      'transaction_processed',
      new TransactionProcessedEvent(transactionCreatedEvent.id, newStatus),
    );
  }
}
