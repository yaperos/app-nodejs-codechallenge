const StatesTransaction = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

type StatesTransactionType = typeof StatesTransaction[keyof typeof StatesTransaction];

export {
	type StatesTransactionType,
  StatesTransaction
};
