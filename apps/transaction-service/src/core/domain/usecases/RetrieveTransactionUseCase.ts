import { TransactionOutput } from '../models';

export type RetrieveTransactionUseCaseInput = {
  externalId: string;
};

export type RetrieveTransactionUseCaseOutput = TransactionOutput;
