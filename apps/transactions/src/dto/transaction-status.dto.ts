import { IsNumber, IsUUID } from 'class-validator';

export class TransactionStatusDto {
  @IsUUID()
  transactionId: string;

  @IsNumber()
  value: number;
}
