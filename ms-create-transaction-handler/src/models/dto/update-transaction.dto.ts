import { IsString, MinLength } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @MinLength(1)
  _id: string;

  @IsString()
  transactionStatus: string;
}
