import { TransactionStatus as TrxStatus } from '../constants/transaction.const';
export type TransactionStatus = (typeof TrxStatus)[keyof typeof TrxStatus];
