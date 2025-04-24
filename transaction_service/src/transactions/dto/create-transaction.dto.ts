import { IsNotEmpty, IsNumber, IsUUID, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsUUID('4', { message: 'accountExternalIdDebit must be a valid UUID' })
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID('4', { message: 'accountExternalIdCredit must be a valid UUID' })
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt({ message: 'transferTypeId must be an integer' })
  @Min(1, { message: 'transferTypeId must be at least 1' })
  @IsNotEmpty()
  transferTypeId: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Value must be a number with up to 2 decimal places' },
  )
  @Min(0.01, { message: 'Value must be greater than 0' })
  @IsNotEmpty()
  @Type(() => Number)
  value: number;
}