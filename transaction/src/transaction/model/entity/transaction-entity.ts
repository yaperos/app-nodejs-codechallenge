import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransactionEntity {

  constructor(amount: number, type: number, status: number, created_at: Date) {
    this.amount = amount;
    this.type = type;
    this.status = status;
    this.created_at = created_at;
  }

  amount: number;

  type: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  status: number;

  created_at: Date;

  @IsUUID()
  account_debit_id: string;

  @IsUUID()
  account_credit_id: string;

  @IsUUID()
  uuid: string;
}
