import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  transactionTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  value: number;
}
