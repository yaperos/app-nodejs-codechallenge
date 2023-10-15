export const isApprovedTransactionValue = (amount: number): string => {
  if (amount > 1000) return 'rejected';
  return 'approved';
};
