export const getTransactionStatus = (value: number): string => {
  if (value > 1000) return process.env.TRANSACTION_REJECTED_STATUS;
  return process.env.TRANSACTION_SUCCESS_STATUS;
};
