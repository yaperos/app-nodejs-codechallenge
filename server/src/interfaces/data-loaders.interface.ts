import DataLoader from 'dataloader';
import { TransactionStatus } from 'src/entities/transaction-status.entity';
import { TransactionType } from 'src/entities/transaction.type.entity';

export interface IDataloaders {
  transactionStatusLoader: DataLoader<number, TransactionStatus>;
  transactionTypeLoader: DataLoader<number, TransactionType>;
}
