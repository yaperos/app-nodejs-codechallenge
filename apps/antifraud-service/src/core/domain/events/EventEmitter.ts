import { Transaction } from '../models';

export interface EventEmitter {
  sendApprovedTransactionEvent(transaction: Transaction): void;
  sendRejectedTransactionEvent(
    transaction: Transaction,
    errorMessage: string,
  ): void;
}
