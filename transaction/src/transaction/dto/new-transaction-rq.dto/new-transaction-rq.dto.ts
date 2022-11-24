import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class NewTransactionRqDto {

  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
