import {RetrieveTransaction} from "../entities/retrieve_transaction.entity";
import { Transaction as TransactionModel } from '@prisma/client'
import {TransactionStatus} from "../../../../common/enums/transaction-status";

export class TransactionMapper {
    static toDto(transaction:TransactionModel): RetrieveTransaction  {
        return {
            createdAt: transaction.createdAt,
            transactionExternalId: transaction.transactionExternalId,
            transactionStatus: {name:  TransactionStatus[transaction.status]  },
            transactionType: {name: (transaction.type).toString() },
            value: Number(transaction.value)

        }
    }
}