import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
