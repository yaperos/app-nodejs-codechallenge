import { Transaction } from '../models';

export type ValidateTransactionUseCaseInput = {
  transaction: Transaction;
};

export type ValidateTransactionUseCaseOutput = {
  success: boolean;
};
