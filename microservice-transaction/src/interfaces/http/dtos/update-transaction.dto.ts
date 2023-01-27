import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
