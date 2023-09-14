import { StatusTransactions } from '../../domain/enums/status.enum';

export class FindTransactionDto {
  id?: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId?: number;
  value?: number;
  status?: StatusTransactions;
}
