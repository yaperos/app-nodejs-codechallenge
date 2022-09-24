import { IsString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountExternalIdDebit: string;

  @IsString()
  accountExternalIdCredit: string;

  @IsInt()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
