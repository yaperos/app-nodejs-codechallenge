import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';

// export class CreateTransactionDto {
//   @IsUUID()
//   @IsNotEmpty()
//   @Expose({ name: 'accountExternalIdDebit' })
//   account_external_id_debit: string;
//
//   @IsUUID()
//   @IsNotEmpty()
//   @Expose({ name: 'accountExternalIdCredit' })
//   account_external_id_credit: string;
//
//   @IsInt()
//   @Expose({ name: 'transactionType' })
//   transaction_type_id: number;
//
//   @IsNumber()
//   value: number;
// }

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;
  @IsUUID()
  accountExternalIdCredit: string;
  @IsInt()
  transactionType: number;
  @IsNumber()
  @IsPositive()
  value: number;

  static toPartialTransaction(
    data: CreateTransactionDto,
  ): Partial<Transaction> {
    return {
      account_external_id_debit: data.accountExternalIdDebit,
      account_external_id_credit: data.accountExternalIdCredit,
      transaction_type_id: data.transactionType,
      value: data.value,
    };
  }
}
