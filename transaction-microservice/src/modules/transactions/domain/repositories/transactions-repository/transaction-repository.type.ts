import { z } from 'zod';
import { ZTransaction } from '../../types';

// Register Transaction
export const ZRegisterTransactionInput = ZTransaction.omit({
  id: true,
  status: true,
  transferType: true,
  createdAt: true,
  updatedAt: true,
});
export type RegisterTransactionInput = z.infer<
  typeof ZRegisterTransactionInput
>;

export const ZRegisterTransactionOutput = ZTransaction.omit({
  transferType: true,
});
export type RegisterTransactionOutput = z.infer<
  typeof ZRegisterTransactionOutput
>;
