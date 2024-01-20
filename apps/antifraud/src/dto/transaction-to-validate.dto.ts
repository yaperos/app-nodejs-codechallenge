import { IsNumber, IsUUID } from 'class-validator';

export class TransactionToValidate {
  @IsUUID()
  transactionId: string;

  @IsNumber()
  value: number;
}
