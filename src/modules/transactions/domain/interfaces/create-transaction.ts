import { StatusTransactions } from '../../domain/enums/status.enum';

export interface ICreateTransaction {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status?: StatusTransactions;
}
