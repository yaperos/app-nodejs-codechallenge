export const MICROSERVICES_CONSTANTS = Object.freeze({
    ANTI_FRAUD_MICROSERVICE: {
        name: 'ANTI_FRAUD_MICROSERVICE',
        groupId: 'anti-fraud-consume'
    },
    TRANSFER_MANAGER_MICROSERVICE: {
        name: 'TRANSFER_MANAGER_MICROSERVICE',
        groupId: 'transfer-manager-consume'
    },
    EVENTS: {
        TRANSACTION_APPROVED: 'transaction_approved',
        TRANSACTION_REJECTED: 'transaction_rejecetd',
        TRANSACTION_CREATED: 'transaction_created',
        CREATE_TRANSACTION: 'create_transaction',
        GET_TRANSACTION: 'get_transaction'
    }
})
