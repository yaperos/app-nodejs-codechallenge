import { TransactionApprovedEventHandler } from './transaction-approved.event.handler';
import { TransactionRejectedEventHandler } from './transaction-rejected.event.handler';

export const EventHandlers = [
  TransactionApprovedEventHandler,
  TransactionRejectedEventHandler,
];
