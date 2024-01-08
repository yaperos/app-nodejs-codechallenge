import { TransactionApprovedEvent } from 'src/transactions/events/transaction-approved.event';
import { TransactionCreatedEvent } from 'src/transactions/events/transaction-created.event';
import { TransactionRejectedEvent } from 'src/transactions/events/transaction-rejected.event';

export enum TransactionStatusEnum {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export enum TransferTypeEnum {
  P2P = 1,
  PP = 2,
}

export const Events = {
  TransactionCreatedEvent,
  TransactionApprovedEvent,
  TransactionRejectedEvent,
};
