export enum ETransactionStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

export type TTransactionStatus = `${ETransactionStatus}`;

export enum EReportedBy {
  MS_ANTI_FRAUD = "ms-anti-fraud",
}

export interface IRequestVerifyTransaction {
  transactionId: string;
  value: number;
}

export interface IResponseVerifyTransaction {
  transactionId: string;
  status: TTransactionStatus;
}
