import { Repository } from "typeorm";
import { TransactionsDataSource } from "../../../../adapters/infrastructure/db";
import { ITransactionStatusRepository } from "../../domain/interfaces/repositories/transaction-status.repository.interface";
import { TransactionStatus } from "../../domain/entities/transaction-status.entity";
import { TransactionStatusEntity } from "../persistence/typeorm/entities";

export class TransactionTypeRepository implements ITransactionStatusRepository {
    private repository: Repository<TransactionStatusEntity>;

    constructor() {
        this.repository = TransactionsDataSource.getRepository(TransactionStatusEntity);
    }

    public async findOneById(id: number): Promise<TransactionStatus | null> {
        const transactionStatusEntity = await this.repository.findOne({
            where: { id }
        });
        if (!transactionStatusEntity) return null;

        const transactionStatus = new TransactionStatus();
        transactionStatus.setId(transactionStatusEntity.id);
        transactionStatus.setName(transactionStatusEntity.name);

        return transactionStatus;
    }
}