import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ValidateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
