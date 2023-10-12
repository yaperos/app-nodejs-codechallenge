export const isApprovedTransactionValue = (amount: number): boolean => {
  if (amount > 1000) return false;
  return true;
};
