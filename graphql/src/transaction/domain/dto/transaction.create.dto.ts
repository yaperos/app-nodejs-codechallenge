import { StatusesEnum } from '../enum/transaction.statuses';

export class DomainCreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusesEnum;
}
