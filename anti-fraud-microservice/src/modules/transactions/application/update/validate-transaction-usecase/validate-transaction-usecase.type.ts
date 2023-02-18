import { z } from 'zod';
import { ZTransaction, ZValidValueTransaction } from '../../../domain/types';

// **** ValidateTransactionUseCase  **** //
export const ValidateTransactionUseCaseInput = ZTransaction.extend({
  value: ZValidValueTransaction,
});
export type ValidateTransactionUseCaseInputType = z.infer<
  typeof ValidateTransactionUseCaseInput
>;

export const ValidateTransactionUseCaseOutput = ZTransaction;
export type ValidateTransactionUseCaseOutputType = z.infer<
  typeof ValidateTransactionUseCaseOutput
>;
