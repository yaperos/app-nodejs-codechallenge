import { Transaction } from "src/domain/aggregates/transaction";

export class GetTransactionByIdDto{
    static reponse(transaction: Transaction){
        return {
            transactionExternalId: transaction.getTransactionExternalId(),
            accountExternalIdDebit: transaction.getAccountExternalIdDebit(),
            accountExternalIdCredit: transaction.getAccountExternalIdCredit(),
            tranferType: transaction.getTranferType(),
            status: transaction.getStatus(),
            value: transaction.getValue(),
        }
    }
}