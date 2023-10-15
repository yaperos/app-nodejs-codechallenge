export const getTransactionStatus = (amount: number): string => {
  if (amount > 1000) return process.env.TRANSACTION_REJECTED_STATUS;
  return process.env.TRANSACTION_SUCCESS_STATUS;
};
