import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  transactionTypeId: number;

  @IsNotEmpty()
  value: number;
}
