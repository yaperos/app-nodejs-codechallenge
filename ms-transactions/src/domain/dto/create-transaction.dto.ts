import { IsNotEmpty, IsNumber, IsUUID, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}
