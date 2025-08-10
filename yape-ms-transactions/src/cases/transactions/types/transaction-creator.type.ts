import { MakeOptional } from '../../../common/helpers';
import { Transaction } from '../models';

export type TransactionCreator = MakeOptional<
  Transaction,
  'transactionStatusName' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
