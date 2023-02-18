import { z } from 'zod';

export const ZTransactionStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
