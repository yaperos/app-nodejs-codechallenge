import { IsNumber, IsUUID } from 'class-validator';

export class TransactionStatusDto {
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  value: number;
}
