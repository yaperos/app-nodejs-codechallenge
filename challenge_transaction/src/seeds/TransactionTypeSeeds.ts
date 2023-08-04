'use strict';

import { ITransactionType } from '../models/transaction/transactionType/ITransactionType';

function generateTransactionType(){
    let transactionType1:ITransactionType = {id:1, name: "Credit"},
        transactionType2:ITransactionType = {id:2, name: "Debit"},
        transactionTypeArray:ITransactionType[] = [transactionType1, transactionType2];
    return transactionTypeArray;
}

export { generateTransactionType }