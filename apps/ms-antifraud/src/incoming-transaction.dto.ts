import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class IncomingTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  value: number;
}
