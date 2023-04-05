import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  value: number;
}
