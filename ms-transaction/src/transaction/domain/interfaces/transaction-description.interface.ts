import { TransactionTransferTypeName } from '../enums/transaction-transfer-type.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface TransactionDescription {
  transactionExternalId: string;
  transactionType: {
    name: TransactionTransferTypeName;
  };
  transactionStatus: {
    name: TransactionStatus;
  };
  value: number;
  createdAt: Date;
}
