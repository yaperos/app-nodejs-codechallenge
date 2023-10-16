import { Builder } from 'builder-pattern';
import { TransactionStatus, TransferType } from '../entity/transaction';

export class TransactionDto {
  public transactionExternalId: string;
  public transactionType: {
    name: TransferType;
  };
  public transactionStatus: {
    name: TransactionStatus;
  };
  public value: number;
  public createdAt: Date;

  public static builder() {
    return Builder<TransactionDto>();
  }
}
