import { RESOURCE_TRANSACTION } from '../constants/interfaces';
import { TRANSACTION_STATUS } from '../constants/index';

export const isTransactionStatusPending = (resource: RESOURCE_TRANSACTION) => {
    return resource && resource.transactionStatus && resource.transactionStatus.name === TRANSACTION_STATUS.PENDING;
}