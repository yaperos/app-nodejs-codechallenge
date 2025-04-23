import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { TransactionStatus } from '../enums/transaction-status';

export class CreateTransactionRequestDto {
  @IsString()
  @IsUUID(4)
  accountExternalIdDebit: string;

  @IsString()
  @IsUUID(4)
  accountExternalIdCredit: string;

  @IsNumber()
  @IsEnum(TransactionStatus)
  transferTypeId: number;

  @IsNumber()
  value: number;
}
