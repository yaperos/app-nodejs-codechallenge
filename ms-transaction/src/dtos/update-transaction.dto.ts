import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsString()
  @IsNotEmpty()
  status: number;
}
