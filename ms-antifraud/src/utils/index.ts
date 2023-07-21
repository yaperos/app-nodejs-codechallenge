export const TRANSACTION_STATUS = {
    APPROVED: true,
    REJECTED: false
}

export function validateTransaction(value: number) {
    return value > 1000 ? TRANSACTION_STATUS.REJECTED : TRANSACTION_STATUS.APPROVED
} 