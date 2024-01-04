import { TransactionStatusEnum } from 'src/transaction/enums/transaction.status.enum';

export interface TransactionUpdated {
  id: string;
  transactionStatus: TransactionStatusEnum;
}
