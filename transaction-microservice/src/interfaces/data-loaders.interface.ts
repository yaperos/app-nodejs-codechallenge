import DataLoader from 'dataloader';
import { TransactionStatus } from 'src/database/entities/transaction-status.entity';
import { TransactionType } from 'src/database/entities/transaction.type.entity';

export interface IDataloaders {
  transactionStatusLoader: DataLoader<number, TransactionStatus>;
  transactionTypeLoader: DataLoader<number, TransactionType>;
}
