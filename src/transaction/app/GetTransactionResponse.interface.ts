import { ETransactionAntiFraudResponse } from ".";

export interface IGetTransactionResponse {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: ETransactionAntiFraudResponse;
  };
  value: number;
  createdAt: number;
}
