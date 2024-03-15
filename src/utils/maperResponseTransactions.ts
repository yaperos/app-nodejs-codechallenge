import { ITransaction } from "@/types/transaction.type"

export function maperResponseTransactions(data: ITransaction[]) {
  const transactions = data.map(transaction => ({
    transactionExternalId: transaction.transactionId,
    transactionType: {
      name: transaction.tranferTypeId
    },
    transactionStatus: {
      name: transaction.transactionStatus
    },
    value: transaction.value,
    createdAt: transaction.createdAt
  }))

  return transactions
}