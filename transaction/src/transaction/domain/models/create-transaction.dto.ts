import { z } from 'zod';

export const TransactionSchemaValidate = z.object({
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  tranferTypeId: z.number(),
  value: z.number(),
});

export type CreateTransactionDto = z.infer<typeof TransactionSchemaValidate>;
