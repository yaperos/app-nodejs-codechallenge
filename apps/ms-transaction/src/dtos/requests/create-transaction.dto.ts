import { IsString, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsPositive()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
