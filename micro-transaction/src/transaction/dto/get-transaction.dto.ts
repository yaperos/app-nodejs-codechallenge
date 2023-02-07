import { Expose, Transform } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatusConstant } from '../../transaction-status/constants/transaction-status.constant';
import { TransactionTypesConstant } from '../../transaction-type/constants/transaction-type.constant';

@Expose()
export class GetTransactionDto {
  @Expose({ name: 'transactionExternalId' })
  id_transaction: number;

  @Expose({ name: 'transactionType' })
  @Transform(({ value }) => ({
    name: TransactionTypesConstant.getListTransactionsTypes().find(
      (ts) => ts.id_transaction_type == value,
    ).name,
  }))
  transfer_type_id: number;

  @Expose({ name: 'transactionStatus' })
  @Transform(({ value }) => ({
    name: TransactionStatusConstant.getListStatus().find(
      (ts) => ts.id_transaction_status == value,
    ).name,
  }))
  transfer_status_id: number;

  @Expose()
  value: number;

  @Expose({ name: 'createdAt' })
  created_at: Date;

  constructor(data: Partial<Transaction>) {
    Object.assign(this, data);
  }
}
