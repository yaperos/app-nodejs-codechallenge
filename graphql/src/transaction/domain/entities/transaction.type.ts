import { StatusesEnum } from '../enum/transaction.statuses';

export class Transaction {
  id?: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusesEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
