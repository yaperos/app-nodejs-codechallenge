import { Injectable, Inject } from '@nestjs/common';
import { isApprovedTransactionValue } from './utils';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionProcessedEvent } from './transaction-processed.event';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly antifraudClient: ClientKafka,
  ) {}
  handleTransactionCreated(transactionCreatedEvent) {
    const isApproved = isApprovedTransactionValue(
      transactionCreatedEvent.amount,
    );
    console.log('holaaa');
    this.antifraudClient.emit(
      'transaction_processed',
      new TransactionProcessedEvent(transactionCreatedEvent.id, isApproved),
    );
    return isApproved;
  }
}
