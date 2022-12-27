export enum TransactionType {
  WITHDRAW = 1,
  EXTRANSAC = 2,
  INTRANSAC = 3,
}

const transactionTypeName = new Map<TransactionType, string>([
  [TransactionType.INTRANSAC, 'WIRE TO INTERNAL ACCOUNT'],
  [TransactionType.EXTRANSAC, 'WIRE TO EXTERNAL ACCOUNT'],
  [TransactionType.WITHDRAW, 'WITHDRAWAL OF MONEY'],
])

export const getTransactionTypeName = (transactionType: TransactionType) => {
  return transactionTypeName.get(transactionType) ?? ''
}
