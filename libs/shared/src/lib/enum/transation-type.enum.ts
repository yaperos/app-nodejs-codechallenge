
export enum TransactionType {

    PROPS = 1,
    THIRD = 2,
    IBK = 3

}

const transactionTypeLabel = new Map<TransactionType, string> ([
    [TransactionType.PROPS, 'TRANSFER TO OWN ACCOUNT'],
    [TransactionType.THIRD, 'TRANSFER TO THIRD ACCOUNT'],
    [TransactionType.IBK, 'TRANSFER TO INTERBANK ACCOUNT']
])

export const getTransactionTypeLabel = (transactionType: TransactionType) => {
    return transactionTypeLabel.get(transactionType);
}