import { z } from 'zod';
import { ZTransaction } from '../../../domain/types';

// *****UpdateTransactionStatusUseCase ***** //
export const UpdateTransactionStatusUseCaseInput = ZTransaction.pick({
  id: true,
  status: true,
});
export type UpdateTransactionStatusUseCaseInputType = z.infer<
    typeof UpdateTransactionStatusUseCaseInput
>;