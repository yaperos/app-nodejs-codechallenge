import { z } from 'zod';

export const ZTransaction = z.object({
  id: z.string().uuid(),
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  transferTypeId: z.number().int().positive(),
  value: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
