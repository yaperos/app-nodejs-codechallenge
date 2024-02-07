import {
  TransactionStatus,
  TransactionTypeEnum,
} from 'src/shared/domain/transaction.model';

export interface TransactionCreatedEventInput {
  id: string;
  value: number;
  status: TransactionStatus;
  updateAt: Date;
  createdAt: Date;
  transactionTypeId: TransactionTypeEnum;
  transactionTypeName: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
}
