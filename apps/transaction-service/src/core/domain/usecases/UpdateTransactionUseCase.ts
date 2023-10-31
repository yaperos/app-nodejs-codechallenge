import { TransactionOutput } from '../models';

export type UpdateTransactionUseCaseInput = {
  id: string;
  status: string;
  errorMessage?: string;
};

export type UpdateTransactionUseCaseOutput = TransactionOutput;
