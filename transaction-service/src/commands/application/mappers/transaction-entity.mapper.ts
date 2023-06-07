import { Transaction } from "src/commands/domain/transaction.domain";
import { TransactionEntity } from "src/commands/infraestructure/adapters/out/entities/transaction.entity";

export class TransactionEntityMapper {
    public static toEntity(transaction: Transaction): TransactionEntity {
        return this.maptoEntity(transaction);
    }

    public static toDomain(transactionEntity: TransactionEntity): Transaction {
        return this.mapToDomain(transactionEntity);
    }

    public static commandToDomain(command): Transaction {
        return this.mapCommandToDomain(command);
    }

    private static maptoEntity(transaction: Transaction): TransactionEntity {
        const entity = new TransactionEntity();
        entity.accountExternalIdDebit = transaction.accountExternalIdDebit;
        entity.accountExternalIdCredit = transaction.accountExternalIdCredit;
        entity.tranferTypeId = transaction.tranferTypeId;
        entity.value = transaction.value;
        entity.createdAt = transaction.createdAt;

        return entity;
    }

    private static mapToDomain(transactionEntity: TransactionEntity): Transaction {
        const domain = new Transaction();
        domain.transactionExternalId = transactionEntity.transactionExternalId;
        domain.accountExternalIdCredit = transactionEntity.accountExternalIdCredit;
        domain.accountExternalIdDebit = transactionEntity.accountExternalIdDebit;
        domain.tranferTypeId = transactionEntity.tranferTypeId;
        domain.value = transactionEntity.value;
        domain.status = transactionEntity.status;
        domain.createdAt = transactionEntity.createdAt;
        return domain;
    }

    private static mapCommandToDomain(command): Transaction {
        const domain = new Transaction();
        domain.accountExternalIdCredit = command.accountExternalIdCredit;
        domain.accountExternalIdDebit = command.accountExternalIdDebit;
        domain.tranferTypeId = command.tranferTypeId;
        domain.value = command.value;
        domain.status = command.status;
        domain.createdAt = command.createdAt;
        return domain;
    }
}