import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Transaction } from "./entities/Transaction.entity";
import { TransactionType } from "./entities/TransactionType.entity";
import { TransactionStatus } from "./entities/TransactionStatus.entity";
import { NewTransactionDto } from "./dto/NewTransactionDto";
import { ValidationRequestDto } from "./dto/ValidationRequestDto";
import { TransactionStatusesType } from "./helper/TransactionStatuses";
import { ProducerService } from "src/kafka/producer/producer.service";

@Injectable()
export class TransactionsService {
    private logger = new Logger(TransactionsService.name);

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(TransactionType)
        private readonly transactionTypeRepository: Repository<TransactionType>,
        @InjectRepository(TransactionStatus)
        private readonly transactionStatusRepository: Repository<TransactionStatus>,
        // Kafka producer
        private readonly kafka: ProducerService,
    ) {
        (async () => {
            // Agregamos los tipos de transaccion
            await transactionTypeRepository.upsert(
                [
                    { transactionTypeId: 1, name: "DEPOSIT" },
                    { transactionTypeId: 2, name: "WITHDRAWAL" },
                ],
                ["transactionTypeId"],
            );

            // Agregamos los tipos de estado
            await transactionStatusRepository.upsert(
                [
                    { transactionStatusId: 1, name: "PENDING" },
                    { transactionStatusId: 2, name: "APPROVED" },
                    { transactionStatusId: 3, name: "REJECTED" },
                ],
                ["transactionStatusId"],
            );
        })();
    }

    async getTransaction(transactionExternalId: string): Promise<Transaction> {
        return this.transactionRepository.findOneOrFail({
            where: {
                transactionExternalId: transactionExternalId,
            },
            relations: ["transactionType", "transactionStatus"],
        });
    }

    async createTransaction(newTransaction: NewTransactionDto): Promise<Transaction> {
        const transaction = this.transactionRepository.create({
            accountExternalIdDebit: newTransaction.accountExternalIdDebit,
            accountExternalIdCredit: newTransaction.accountExternalIdCredit,
            transactionTypeId: newTransaction.tranferTypeId,
            value: newTransaction.value,
            createdAt: new Date(),
        });
        return this.transactionRepository
            .save(transaction)
            .then((result) => {
                return this.getTransaction(result.transactionExternalId);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    async updateTransactionStatus(
        transactionId: string,
        status: TransactionStatusesType,
    ): Promise<Transaction> {
        let saved_transaction = await this.getTransaction(transactionId);
        if (saved_transaction === undefined) return Promise.reject("Transaction not found, could not update");

        saved_transaction.transactionStatus.transactionStatusId = status;
        let updated_transaction = await this.transactionRepository.save(saved_transaction);
        const updated_status = await this.transactionStatusRepository.findOne({
            where: { transactionStatusId: updated_transaction.transactionStatusId },
        });
        updated_transaction.transactionStatus.name = updated_status.name;
        return updated_transaction;
    }

    async sendTransactionForValidation(transaction: Transaction) {
        this.logger.log("Sending transaction for validation: " + transaction.transactionExternalId);
        const validation_request = {
            transactionExternalId: transaction.transactionExternalId,
            value: transaction.value,
        } as ValidationRequestDto;

        this.kafka.produce({
            topic: "transaction.created",
            messages: [{ value: JSON.stringify(validation_request) }],
        });
    }
}
