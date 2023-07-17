import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsString()
  transactionStatus: string;
}