import { REQUEST_TRANSACTION, RESOURCE_TRANSACTION } from './transaction.interface';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from './transaction.model';

export const mappearRequestTrasactionToBD = (request: REQUEST_TRANSACTION): RESOURCE_TRANSACTION => {
    return {
        transactionExternalId: request.tranferTypeId == TRANSACTION_TYPE.debit ? request.accountExternalIdDebit : request.accountExternalIdCredit,
        transactionStatus: {
            name: TRANSACTION_STATUS.pending
        },
        transactionType: {
            name: request.tranferTypeId == TRANSACTION_TYPE.debit ? 'debit' : 'credit'
        },
        createdAt: new Date(),
        value: request.value

    }
}