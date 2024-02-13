import { IsInt, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { Transaction } from '../../domain/model/transaction.model';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;

  toModel(): Transaction {
    return {
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      transactionTypeId: this.tranferTypeId,
      amount: this.value,
    };
  }
}
