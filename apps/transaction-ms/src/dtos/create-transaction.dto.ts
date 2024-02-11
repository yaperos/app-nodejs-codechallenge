import { IsDecimal, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

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

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @Min(0.01)
  value: number;
}
