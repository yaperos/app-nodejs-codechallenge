import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @MinLength(1)
  accountExternalIdDebit: string;

  @IsString()
  @MinLength(1)
  accountExternalIdCredit: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  tranferTypeId: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  value: number;
}
