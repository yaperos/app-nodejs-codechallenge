type TNewTransaction = "new_transaction";
type TTransactionRetry = "transaction_retry";

export interface ITransactionRequestMessage {
  readonly type: TNewTransaction;
  correlationId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export interface ITransactionRequestRetryMessage {
  readonly type: TTransactionRetry;
  transactionId: string;
}

export type TTransactionMessage = ITransactionRequestMessage | ITransactionRequestRetryMessage;
