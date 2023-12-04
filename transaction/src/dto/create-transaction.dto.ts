import { IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountExternalIdDebit: string;

  @IsString()
  accountExternalIdCredit: string;

  @IsNumber()
  tranferTypeId: number;

  @IsNumber()
  value: number;
}
