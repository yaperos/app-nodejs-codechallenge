import { TransactionApprovedEvent } from 'src/transactions/events/transaction-approved.event';
import { TransactionCreatedEvent } from 'src/transactions/events/transaction-created.event';
import { TransactionRejectedEvent } from 'src/transactions/events/transaction-rejected.event';

export const Events = {
  TransactionCreatedEvent,
  TransactionApprovedEvent,
  TransactionRejectedEvent,
};
