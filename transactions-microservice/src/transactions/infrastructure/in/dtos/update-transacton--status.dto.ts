import { TransactionStatusEnum } from 'src/transactions/domain/TransactionStatus';
export class UpdateTransactionStatusDto {
  uuid: string;
  value!: number;
  transactionStatus: {
    name: TransactionStatusEnum;
  };
}
