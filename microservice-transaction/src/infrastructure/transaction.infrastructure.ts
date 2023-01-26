import { Logger } from "@nestjs/common";
import { DBProvider } from "src/DBProvider";
import { Transaction } from "src/domain/aggregates/transaction";
import { TransactionRepository } from "src/domain/repositories/transaction.repository";
import { TransactionEntity } from "./entities/transaction.entity";
import { TransactionMapper } from "./mappers/transaction.mapper";

export class TransactionInfrastructure implements TransactionRepository {
    async createTransaction(transaction: Transaction): Promise<Transaction> {
        const transactionEntity = TransactionMapper.toEntity(transaction);
        const transactionSaved = await DBProvider.manager.getRepository(TransactionEntity).save(transactionEntity);
        Logger.log('Transaction saved: ' + transactionSaved)
        return TransactionMapper.toDomain(transactionSaved);
    }
    getTransactionById(id: string): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }
}