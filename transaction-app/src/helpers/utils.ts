import { TRANSACTION_APPROVED, TRANSACTION_REJECTED } from '../constants/transaction';

export const getTransactionStatus = (status: number) => {
  if (status === TRANSACTION_APPROVED) return { name: 'APPROVED' };
  else if (status === TRANSACTION_REJECTED) return { name: 'REJECTED' };
  return { name: 'PENDING' };
};
