import { GetTransactionQuery } from "src/queries/application/queries/impl/get-transaction.query";
import { GetTransactionInputType } from "../inputs/get-transaction.input-type";
import { GetTransactionObjectType } from "../objects/get-transaction.object-type";
import { Transaction } from "src/queries/domain/transaction.domain";
import { TransactionStatusObjectType } from "../objects/transaction-status.object-type";
import { TransactionTypeObjectType } from "../objects/transaction-type.object-type";

export class TransactionMapper {
    public static toQuery(input: GetTransactionInputType): GetTransactionQuery {
        return this.mapToQuery(input);
    }

    public static toObjectType(transaction: Transaction): GetTransactionObjectType {
        return this.mapToObjectType(transaction);
    }

    private static mapToQuery(input: GetTransactionInputType) {
        const query = new GetTransactionQuery();
        query.transactionExternalId = input.transactionExternalId;
        return query;
    }

    private static mapToObjectType(transaction: Transaction) {
        const objectType = new GetTransactionObjectType();
        objectType.transactionExternalId = transaction.transactionExternalId;
        objectType.accountExternalIdCredit = transaction.accountExternalIdCredit;
        objectType.accountExternalIdDebit = transaction.accountExternalIdDebit;
        objectType.tranferTypeId = transaction.tranferTypeId;
        objectType.value = transaction.value;
        objectType.transactionType = new TransactionTypeObjectType();
        objectType.transactionType.name = "external";
        objectType.transactionStatus = new TransactionStatusObjectType();
        objectType.transactionStatus.name = transaction.status;
        objectType.createdAt = transaction.createdAt;
        return objectType;
    }
}