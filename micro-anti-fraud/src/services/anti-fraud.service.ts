import { RESOURCE_TRANSACTION } from '../constants/interfaces';
import { TRANSACTION_STATUS } from '../constants/index';

export const validateTransaction = (resource: RESOURCE_TRANSACTION) => {
    let resourceValidate = {...resource};
    if( resource.value > 200 ) {
        resourceValidate.transactionStatus = {name: TRANSACTION_STATUS.REJECTED};
        return resourceValidate;
    }
    resourceValidate.transactionStatus = {name: TRANSACTION_STATUS.APPROVED};
    return resourceValidate;
}