import { IsNumber, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  id: string;

  @IsNumber()
  transactionStatusId: number;
}
