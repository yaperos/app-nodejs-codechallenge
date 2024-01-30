import { plainToInstance } from "class-transformer";
import { TStatusTransaction, Transaction, TransactionProps } from "../../domain/transaction";
import { TransactionEntity } from "../entities/transaction.entity";

export class TransactionDto {
    static fromDomainToData(transaction: Transaction): TransactionEntity {
        return plainToInstance(TransactionEntity, transaction.properties)
    }

    static fromDataToDomain(entity: TransactionEntity): Transaction {
        const props: TransactionProps = {
            transactionId: entity.transactionId,
            accountExternalIdCredit: entity.accountExternalIdCredit,
            accountExternalIdDebit: entity.accountExternalIdDebit,
            transferTypeId: entity.transferTypeId,
            value: entity.value,
            status: entity.status as TStatusTransaction,
            createdAt: entity.createdAt,
            updateAt: entity.updateAt
        }

        return new Transaction(props)
    }
}