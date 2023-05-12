import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './transaction.entity';

import { TransferType } from './transfer.entity';

const entities = [
  TransactionStatus,
  TransactionType,
  TransferType,
  Transaction,
];

export { Transaction, TransactionStatus, TransactionType, TransferType };
export default entities;
