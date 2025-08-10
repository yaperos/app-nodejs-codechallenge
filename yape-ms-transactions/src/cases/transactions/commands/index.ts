import { CreateTransactionHandler } from './handlers/create-transaction.handler';
import { UpdateTransactionStatusHandler } from './handlers/update-transaction-status.handler';

export const Commands = [
  CreateTransactionHandler,
  UpdateTransactionStatusHandler,
];
