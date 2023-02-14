import { SubscribeTo } from 'nestjs-kafkajs';
import { Injectable } from '@nestjs/common';
import { TransactionStatusChanged } from './events';
import { ExternalTransactionsService } from './external-transactions.service';

@Injectable()
export class ExternalTransactionsSubscriber {
  constructor(
    private readonly externalTransactionsService: ExternalTransactionsService,
  ) {}

  @SubscribeTo('transaction.status.validated')
  handleTransactionStatusValidated(message: TransactionStatusChanged) {
    return this.externalTransactionsService.updateStatusById(
      message.id,
      message.status,
    );
  }
}
