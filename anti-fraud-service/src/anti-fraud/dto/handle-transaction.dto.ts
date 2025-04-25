import { IsNumber, IsUUID } from 'class-validator';

export class HandleTransactionDto {
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  amount: number;
}
