import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountExternalIdDebit: string;
  @IsString()
  accountExternalIdCredit: string;
  @IsInt()
  @IsPositive()
  tranferTypeId: number;
  @IsNumber()
  @IsPositive()
  value: number;
}
