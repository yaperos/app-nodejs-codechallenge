import {Repository} from "typeorm";
import {AppDataSource} from "../../infrastructure/database/datasource";
import {TransactionEntity} from "../../infrastructure/database/entities/transaction.entity";
import {sendKafkaMessage} from "../../infrastructure/kafka/producers/kafka-producer";
import {Status} from "../entities/status";
import {logger} from "../bootstrap/logger";

export class TransactionService {

    private readonly transactionRepository: Repository<TransactionEntity>;

    constructor() {
        this.transactionRepository = AppDataSource.getRepository(TransactionEntity);
    }

    async getTransactionById(id: string): Promise<TransactionEntity | null> {
        return await this.transactionRepository.findOne({where: {id: id,},});
    }

    async createTransaction(params: any): Promise<TransactionEntity> {
        const data = new TransactionEntity();
        data.accountExternalIdDebit = params.accountExternalIdDebit
        data.accountExternalIdCredit = params.accountExternalIdCredit
        data.status = Status.PENDING
        data.transferTypeId = params.transferTypeId
        data.value = params.value

        const transaction = await this.transactionRepository.save(data);

        await sendKafkaMessage({id: transaction.id, value: transaction.value});

        return transaction;
    }

    async approveTransaction(id: string) {
        await this.updateTransactionStatus(id, Status.APPROVED)
    }

    async rejectTransaction(id: string) {
        await this.updateTransactionStatus(id, Status.REJECTED)
    }

    async updateTransactionStatus(id: string, status: string) {
        try {
            await this.transactionRepository.update({id}, {status});
        } catch (error) {
            logger.error(error);
        }
    }
}