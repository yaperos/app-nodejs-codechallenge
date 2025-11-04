import { Type } from 'class-transformer';
import { IsUUID, IsNotEmpty, IsInt, IsNumber, IsPositive } from 'class-validator';

export class ValidateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  transferTypeId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  value: number;
}