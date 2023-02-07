import { ZTransaction } from '../../../domain/types';
import { z } from 'zod';

// ***** RegisterTransactionUseCase ***** //
export const RegisterTransactionUseCaseInput = ZTransaction.omit({
  id: true,
  status: true,
  transferType: true,
  createdAt: true,
  updatedAt: true,
});
export type RegisterTransactionUseCaseInputType = z.infer<
  typeof RegisterTransactionUseCaseInput
>;

export const RegisterTransactionUseCaseOutput = ZTransaction.omit({
  transferType: true,
});
export type RegisterTransactionUseCaseOutputType = z.infer<
  typeof RegisterTransactionUseCaseOutput
>;
