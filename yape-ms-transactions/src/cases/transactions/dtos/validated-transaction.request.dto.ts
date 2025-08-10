import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatedTransactionRequestDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
