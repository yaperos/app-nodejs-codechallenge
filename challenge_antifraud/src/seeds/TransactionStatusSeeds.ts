'use strict';

import { ITransactionStatus } from '../models/transaction/transactionStatus/ITransactionStatus';

function generateTransactionStatus(){
    let transactionStatus1:ITransactionStatus = {id:1, name: "Pending"},
        transactionStatus2:ITransactionStatus = {id:2, name: "Approved"},
        transactionStatus3:ITransactionStatus = {id:3, name: "Rejected"},
        transactionStatusArray:ITransactionStatus[] = [transactionStatus1, transactionStatus2, transactionStatus3];
    return transactionStatusArray;
}

export { generateTransactionStatus }