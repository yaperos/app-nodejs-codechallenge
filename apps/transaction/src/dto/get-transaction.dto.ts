import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class GetTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  transactionExternalId: string;
}
