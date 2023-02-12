export function serialize(transaction) {
    return {
        transactionExternalId: transaction.id,
        transactionType: {
            name: transaction.tranferTypeId
        },
        transactionStatus: {
            name: transaction.status
        },
        value: transaction.value,
        createdAt: transaction.createdAt,
    }
}