import dayjs from "dayjs";

export interface CreateTransactionBody {
  accountExternalIdCredit: string;
  accountExternalIdDebit: string;
  transferTypeId: number;
  value: number;
}

export interface IDeadlineTime {
  value: number;
  unit: dayjs.ManipulateType;
}

export interface ITransactionResponse {
  id: string;
}
