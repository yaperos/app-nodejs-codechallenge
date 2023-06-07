import { Transaction } from "src/queries/domain/transaction.domain";
import { TransactionDocument } from "src/queries/infraestructure/adapters/out/documents/transaction.document";
import { CreateTransactionCommand } from "../commands/impl/create-transaction.command";

export class TransactionDocumentMapper {
    public static toDocument(transaction: Transaction): TransactionDocument {
        return this.mapToDocument(transaction);
    }

    public static toDomain(transactionDocument: TransactionDocument): Transaction {
        return this.mapToDomain(transactionDocument);
    }

    public static commandToDomain(command: CreateTransactionCommand): Transaction {
        return this.mapCommandToDomain(command);
    }

    private static mapToDocument(transaction: Transaction): TransactionDocument {
        const entity = new TransactionDocument();
        entity._id = transaction.transactionExternalId;
        entity.accountExternalIdDebit = transaction.accountExternalIdDebit;
        entity.accountExternalIdCredit = transaction.accountExternalIdCredit;
        entity.tranferTypeId = transaction.tranferTypeId;
        entity.value = transaction.value;
        entity.status = transaction.status;
        entity.createdAt = transaction.createdAt;
        return entity;
    }

    private static mapToDomain(transactionDocument: TransactionDocument): Transaction {
        const domain = new Transaction();
        domain.transactionExternalId = transactionDocument._id;
        domain.accountExternalIdCredit = transactionDocument.accountExternalIdCredit;
        domain.accountExternalIdDebit = transactionDocument.accountExternalIdDebit;
        domain.tranferTypeId = transactionDocument.tranferTypeId;
        domain.status = transactionDocument.status;
        domain.value = transactionDocument.value;
        domain.createdAt = transactionDocument.createdAt;
        return domain;
    }

    private static mapCommandToDomain(command): Transaction {
        const domain = new Transaction();
        domain.transactionExternalId = command.transactionExternalId;
        domain.accountExternalIdCredit = command.accountExternalIdCredit;
        domain.accountExternalIdDebit = command.accountExternalIdDebit;
        domain.tranferTypeId = command.tranferTypeId;
        domain.value = command.value;
        domain.status = command.status;
        domain.createdAt = command.createdAt;
        domain.action = command.action;
        return domain;
    }
}