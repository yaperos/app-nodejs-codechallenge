import { StatusTransactions } from '../../domain/enums/status.enum';

export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status?: StatusTransactions;
}
