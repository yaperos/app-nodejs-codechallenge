import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  transactionExternalId: string;

  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  tranferTypeId: number;

  status: string;

  @IsNotEmpty()
  value: number;
}
