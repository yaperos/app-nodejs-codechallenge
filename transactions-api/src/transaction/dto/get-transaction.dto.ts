import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionStatus } from './update-transaction.dto';

export class GetTransactionDTO {
  @IsString()
  @IsOptional()
  transactionExternalId?: string;

  @IsNotEmpty()
  @IsOptional()
  transactionType?: { name: string };

  @IsNotEmpty()
  @IsOptional()
  transactionStatus?: { name: TransactionStatus };

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  createdAt?: string;
}
