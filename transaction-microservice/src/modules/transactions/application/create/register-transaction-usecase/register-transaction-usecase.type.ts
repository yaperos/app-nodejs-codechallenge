import { ZTransaction } from 'src/modules/transactions/domain/types';
import { z } from 'zod';

// ***** RegisterTransactionUseCase ***** //
export const RegisterTransactionUseCaseInput = ZTransaction.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type RegisterTransactionUseCaseInputType = z.infer<
  typeof RegisterTransactionUseCaseInput
>;

export const RegisterTransactionUseCaseOutput = ZTransaction;
export type RegisterTransactionUseCaseOutputType = z.infer<
  typeof RegisterTransactionUseCaseOutput
>;
