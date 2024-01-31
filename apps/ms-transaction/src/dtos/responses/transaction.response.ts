import { IsUUID, IsNumber, IsPositive, IsDate } from 'class-validator';

export class TransactionResponse {
  @IsUUID()
  transactionExternalId: string;

  @IsNumber()
  typeId: number;

  @IsNumber()
  statusId: number;

  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsDate()
  createdAt: Date;
}
