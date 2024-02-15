import { TransactionStatusEnum } from 'apps/api-gateway/src/transactions/enums/transaction.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransactionDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly amount: number;

  @Expose()
  readonly status: TransactionStatusEnum;

  @Expose()
  readonly createdAt: Date;
}
