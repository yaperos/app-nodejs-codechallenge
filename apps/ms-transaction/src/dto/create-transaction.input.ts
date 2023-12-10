import { IsNumber, IsBase64, IsPositive } from 'class-validator';

export class CreateTransactionInput {
  @IsBase64()
  accountExternalIdDebit: string;

  @IsBase64()
  accountExternalIdCredit: string;

  @IsBase64()
  tranferTypeId: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
