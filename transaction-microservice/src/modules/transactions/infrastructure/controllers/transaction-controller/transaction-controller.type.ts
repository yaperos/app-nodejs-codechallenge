import { ZTransaction } from '../../../domain/types';
import { z } from 'zod';

// **** Register Transaction **** //
export const ZRegisterTransactionRequest = ZTransaction.omit({
  id: true,
  status: true,
  transferType: true,
  createdAt: true,
  updatedAt: true,
});
export type RegisterTransactionRequest = z.infer<
  typeof ZRegisterTransactionRequest
>;

export const ZRegisterTransactionResponse = ZTransaction.omit({
  transferType: true,
});
export type RegisterTransactionResponse = z.infer<
  typeof ZRegisterTransactionResponse
>;

// **** Update Transaction Status **** //
export const ZUpdateTransactionStatusRequest = ZTransaction.pick({
  id: true,
  status: true,
});
export type UpdateTransactionStatusRequest = z.infer<
  typeof ZUpdateTransactionStatusRequest
>;

// **** Find One Transaction By Id **** //
export const ZFindOneTransactionByIdRequest = ZTransaction.pick({
  id: true,
});
export type FindOneTransactionByIdRequest = z.infer<
  typeof ZFindOneTransactionByIdRequest
>;

export const ZFindOneTransactionByIdResponse = z.object({
  transactionExternalId: z.string().uuid(),
  transactionType: z.object({
    name: z.string(),
  }),
  transactionStatus: z.object({
    name: z.string(),
  }),
  value: z.number().positive(),
  createdAt: z.date(),
});
export type FindOneTransactionByIdResponse = z.infer<
  typeof ZFindOneTransactionByIdResponse
>;
