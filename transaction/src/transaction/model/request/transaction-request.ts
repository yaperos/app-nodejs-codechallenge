import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransactionRequest {

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
