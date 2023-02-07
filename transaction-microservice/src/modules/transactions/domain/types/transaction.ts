import { z } from 'zod';
import { ZTransactionStatus } from './transaction-status';
import { ZTransferType } from './transfer-type';

export const ZTransaction = z.object({
  id: z.string().uuid(),
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  transferTypeId: z.number().int().positive(),
  value: z.number().positive(),
  status: ZTransactionStatus,
  transferType: ZTransferType,
  createdAt: z.date(),
  updatedAt: z.date(),
});
