import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit?: string;

  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
