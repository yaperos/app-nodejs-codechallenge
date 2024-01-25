export type TTransactionStatus = "APPROVED" | "REJECTED";

export interface IRequestVerifyTransaction {
  transactionId: string;
  value: number;
}

export interface IResponseVerifyTransaction {
  transactionId: string;
  status: TTransactionStatus;
}
