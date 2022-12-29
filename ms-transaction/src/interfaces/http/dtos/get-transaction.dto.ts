import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetTransactionDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  transactionExternalId: string;
}
