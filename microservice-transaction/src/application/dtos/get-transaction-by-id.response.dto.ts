import { Transaction } from "src/domain/aggregates/transaction";

export class GetTransactionByIdDto{
    static reponse(transaction: Transaction){
        return {
            transactionExternalId: transaction.getTransactionExternalId(),
            transactionType: {
                name:  transaction.getTranferType(),
            },
            transactionStatus: {
                name: transaction.getStatus(),
            },
            value: transaction.getValue(),
            createdAt: transaction.getCreatedAt(),
        }
    }
}