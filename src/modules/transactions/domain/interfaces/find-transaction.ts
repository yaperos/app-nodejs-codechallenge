import { StatusTransactions } from '../../domain/enums/status.enum';

export interface IFindTransaction {
  id?: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId?: number;
  value?: number;
  status?: StatusTransactions;
}
