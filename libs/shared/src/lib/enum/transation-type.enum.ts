
export enum TransactionType {

    PROPS = 1,
    THIRD = 2,
    IBK = 3

}

const transactionTypeLabel = new Map<TransactionType, string> ([
    [TransactionType.PROPS, 'DEPOSIT TO OWN ACCOUNT'],
    [TransactionType.THIRD, 'TRANSFER TO ACCOUNT IN SAMEBANK'],
    [TransactionType.IBK, 'TRANSFER TO ACCOUNT IN ANOTHER BANK']
])

export const getTransactionTypeLabel = (transactionType: TransactionType) => {
    return transactionTypeLabel.get(transactionType);
}
