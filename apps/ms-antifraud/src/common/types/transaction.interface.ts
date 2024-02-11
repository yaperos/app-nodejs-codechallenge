import { TransactionStatuses } from "../enums/transaction-statuses.enum";

export interface NewTransactionPayload {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  transferStatusId: TransactionStatuses;
}