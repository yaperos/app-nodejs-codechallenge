import { Repository } from "typeorm";
import { TransactionsDataSource } from "../../../../adapters/infrastructure/db";
import { TransactionEntity, TransferTypeEntity } from "../persistence/typeorm/entities";
import { ITransactionRepository } from "../../domain/interfaces/repositories/transaction.repository.interface";
import { Transaction } from "../../domain/entities/transaction.entity";
import { TransferType } from "../../domain/entities/transfer-type.entity";
import { CustomError } from "../../../../helpers/domain/entities/custom-error";
import { HttpCode } from "../../../../helpers/domain/enums/http-code.enum";

export class TransactionRepository implements ITransactionRepository {
    private transactionRepository: Repository<TransactionEntity>;

    constructor() {
        this.transactionRepository = TransactionsDataSource.getRepository(TransactionEntity);
    }
    
    public async findOneById(id: number): Promise<Transaction | null> {
        const transactionEntity = await this.transactionRepository.findOne({
            where: { id },
            relations: {
                transfer_type: true
            }
        });
        if (!transactionEntity) return null;

        const transferType = new TransferType();
        transferType.setId(transactionEntity.transfer_type.id);
        transferType.setName(transactionEntity.transfer_type.name);

        const transaction = new Transaction();
        transaction.setId(transactionEntity.id);
        transaction.setAccountExternalIdCredit(transactionEntity.account_external_id_credit);
        transaction.setAccountExternalIdDebit(transactionEntity.account_external_id_debit);
        transaction.setStatus(transactionEntity.status);
        transaction.setTransferType(transferType);
        transaction.setValue(transactionEntity.value);
        transaction.setCreatedAt(transactionEntity.created_at);
        transaction.setUpdatedAt(transactionEntity.updated_at);

        return transaction;
    }
    
    public async save(data: Transaction): Promise<Transaction> {
        try {
            const transferTypeEntity = new TransferTypeEntity();
            transferTypeEntity.id = data.getTransferType().getId() as number;
            
            const transactionEntity = new TransactionEntity();
            transactionEntity.account_external_id_credit = data.getAccountExternalIdCredit();
            transactionEntity.account_external_id_debit = data.getAccountExternalIdDebit();
            transactionEntity.value = data.getValue();
            transactionEntity.transfer_type = transferTypeEntity;

            await this.transactionRepository.save(transactionEntity);
            data.setId(transactionEntity.id);
            data.setCreatedAt(transactionEntity.created_at);
            data.setStatus(transactionEntity.status);

            return data;
        } catch(error) {
            console.error(error);
            throw new CustomError({ httpCode: HttpCode.UNPROCCESSABLE_ENTITY, message: "It is not possible to save this new registry of transaction, it must be validated the data." });
        }
    }
}