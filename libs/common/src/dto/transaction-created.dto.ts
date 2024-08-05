import { IsString, IsNumber, IsDate } from 'class-validator';

export class TransactionCreatedRequest {
  @IsString()
  transactionInternalId: string;

  @IsString()
  transactionExternalId: string;

  @IsString()
  accountExternalIdDebit: string;

  @IsString()
  accountExternalIdCredit: string;

  @IsNumber()
  value: number;

  @IsDate()
  createdAt: Date;

  transactionStatus: {
    id: number;
    name: string;
  };

  transactionType: {
    id: number;
    name: string;
  };
}
