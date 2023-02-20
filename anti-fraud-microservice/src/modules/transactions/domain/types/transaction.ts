import { env } from 'process';
import { z } from 'zod';
import { ZTransactionStatus } from './transaction-status';

export const ZTransaction = z.object({
  id: z.string().uuid(),
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  transferTypeId: z.number().int().positive(),
  value: z.number().positive(),
  status: ZTransactionStatus,
});

export const ZValidValueTransaction = z
  .number()
  .positive()
  .max(Number(env.MAX_VALUE_TRANSACTION));
