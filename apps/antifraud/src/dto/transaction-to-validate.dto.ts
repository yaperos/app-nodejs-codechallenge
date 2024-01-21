import { IsNumber, IsUUID } from 'class-validator';

export class TransactionToValidate {
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  value: number;
}
