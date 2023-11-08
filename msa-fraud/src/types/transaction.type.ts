import { TransactionStatus as TrxStatus } from 'src/constants/transaction.const';
export type TransactionStatus = (typeof TrxStatus)[keyof typeof TrxStatus];
