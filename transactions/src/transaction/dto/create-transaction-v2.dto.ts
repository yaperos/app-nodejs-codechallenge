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

export class CreateTransactionDtoV2 implements Partial<Transaction> {
  @IsUUID()
  account_external_id_debit: string;
  @IsUUID()
  account_external_id_credit: string;
  @IsInt()
  transaction_type_id: number;
  @IsNumber()
  @IsPositive()
  value: number;
}
