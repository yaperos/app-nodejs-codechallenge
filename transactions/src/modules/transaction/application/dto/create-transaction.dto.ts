import { IsUUID, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsPositive()
  transferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
