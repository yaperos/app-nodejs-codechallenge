import { TransactionResponse } from "src/helper/type.helper";
import { TransactionModel } from "src/infraestructure/model/transaction.model";


export const getTransactionMapper=(data:TransactionModel):TransactionResponse=>{
    return {
        transactionExternalId:data.id,
        transactionType:{
            name:data.tranferType.name
        },
        transactionStatus:{
            name:data.status
        },
        value:data.value,
        createdAt:data.createdAt
    }
}