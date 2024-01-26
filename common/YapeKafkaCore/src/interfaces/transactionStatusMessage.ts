type TTransactionStatus = "pending" | "approved" | "rejected" | "error";

export interface ITransactionStatusMessage {
  transactionId: string;
  status: TTransactionStatus;
}
