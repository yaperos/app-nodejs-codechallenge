import { IsInt, IsNumber, IsUUID } from 'class-validator';

export class NewTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  tranferTypeId: number;

  @IsNumber()
  value: number;
}
