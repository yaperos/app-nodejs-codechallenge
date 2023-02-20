import { z } from 'zod';
import { ZTransferType } from '../../types';

// Find One Transaction Type By Id
export const ZFindOneTransactionTypeByIdInput = ZTransferType.pick({
  id: true,
});
export type FindOneTransactionTypeByIdInput = z.infer<
    typeof ZFindOneTransactionTypeByIdInput
>;

export const ZFindOneTransactionTypeByIdOutput = ZTransferType;
export type FindOneTransactionTypeByIdOutput = z.infer<
    typeof ZFindOneTransactionTypeByIdOutput
>;