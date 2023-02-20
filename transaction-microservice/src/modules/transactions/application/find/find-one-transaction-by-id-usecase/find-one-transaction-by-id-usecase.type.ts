import { z } from 'zod';
import { ZTransaction } from '../../../domain/types';

// ***** FindOneTransactionByIdUseCase ***** //
export const FindOneTransactionByIdUseCaseInput = ZTransaction.pick({
  id: true,
});
export type FindOneTransactionByIdUseCaseInputType = z.infer<
  typeof FindOneTransactionByIdUseCaseInput
>;

export const FindOneTransactionByIdUseCaseOutput = ZTransaction;
export type FindOneTransactionByIdUseCaseOutputType = z.infer<
  typeof FindOneTransactionByIdUseCaseOutput
>;
