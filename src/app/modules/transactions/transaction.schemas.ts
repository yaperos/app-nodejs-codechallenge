import { z } from "zod";

export const createTransactionBodySchema = z.object({
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  transferTypeId: z.number().int().positive(),
  value: z.number().positive()
});

export const createTransactionHeadersSchema = z.object({
  "idempotency-key": z.string().min(1).max(255)
});

export const transactionIdParamsSchema = z.object({
  transactionExternalId: z.string().uuid()
});

export const transactionResponseSchema = z.object({
  transactionExternalId: z.string().uuid(),
  transactionType: z.object({
    name: z.string()
  }),
  transactionStatus: z.object({
    name: z.string()
  }),
  value: z.number(),
  createdAt: z.string()
});

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>;
export type CreateTransactionHeaders = z.infer<typeof createTransactionHeadersSchema>;
export type TransactionIdParams = z.infer<typeof transactionIdParamsSchema>;
export type TransactionResponse = z.infer<typeof transactionResponseSchema>;
