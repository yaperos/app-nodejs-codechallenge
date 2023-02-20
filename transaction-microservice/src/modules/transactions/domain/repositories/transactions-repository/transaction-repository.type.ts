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

// Update Transaction Status
export const ZUpdateTransactionStatusInput = ZTransaction.pick({
  id: true,
  status: true,
});
export type UpdateTransactionStatusInput = z.infer<
  typeof ZUpdateTransactionStatusInput
>;

// Find One Transaction By Id
export const ZFindOneTransactionByIdInput = ZTransaction.pick({
  id: true,
});
export type FindOneTransactionByIdInput = z.infer<
  typeof ZFindOneTransactionByIdInput
>;

export const ZFindOneTransactionByIdOutput = ZTransaction;
export type FindOneTransactionByIdOutput = z.infer<
  typeof ZFindOneTransactionByIdOutput
>;

