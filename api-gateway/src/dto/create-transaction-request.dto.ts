import { IsNumber, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTransactionRequest {
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([1])
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
