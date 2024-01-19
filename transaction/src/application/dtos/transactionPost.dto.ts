import { Transaction } from "src/domain/transaction";

export class TransactionPostDto {
    static domainToGetResponse(transaction: Transaction) {
        return {
            transactionExternalId: transaction.data().transactionExternalId,
            accountExternalIdDebit: transaction.data().accountExternalIdDebit,
            accountExternalIdCredit: transaction.data().accountExternalIdCredit,
            value: transaction.data().value,
            status: transaction.data().status
        };
    }
}