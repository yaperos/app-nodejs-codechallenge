import { IsInt, IsPositive, IsUUID, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  @IsPositive()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
