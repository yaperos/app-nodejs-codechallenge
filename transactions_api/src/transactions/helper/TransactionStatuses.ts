const TransactionStatuses = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

type TransactionStatusesType = typeof TransactionStatuses[keyof typeof TransactionStatuses];

export {
	type TransactionStatusesType,
    TransactionStatuses
};
