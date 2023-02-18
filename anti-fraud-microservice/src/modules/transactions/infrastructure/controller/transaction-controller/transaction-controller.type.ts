import { ZTransaction, ZTransactionStatus } from '../../../domain/types';
import { z } from 'zod';

//****  Validate Transaction ****//
export const ZValidateTransactionRequest = ZTransaction;
export type ValidateTransactionRequest = z.infer<
  typeof ZValidateTransactionRequest
>;

export const ZValidateTransactionResponse = ZTransactionStatus;
export type ValidateTransactionResponse = z.infer<
  typeof ZValidateTransactionResponse
>;
