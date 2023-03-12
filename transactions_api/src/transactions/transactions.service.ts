import {
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Transaction } from "./entities/Transaction.entity";
import { TransactionType } from "./entities/TransactionType.entity";
import { TransactionStatus } from "./entities/TransactionStatus.entity";
import { NewTransactionDto } from "./dto/NewTransactionDto";
import { TransactionDto } from "./dto/TransactionDto";
import { ClientKafka, MessagePattern, Payload } from "@nestjs/microservices";
import { ValidationRequestDto } from "./dto/ValidationRequestDto";
import { ValidationResultDto } from "./dto/ValidationResultDto";
import { TransactionStatuses, TransactionStatusesType } from "./helper/TransactionStatuses";

@Injectable()
export class TransactionsService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(TransactionType)
        private readonly transactionTypeRepository: Repository<TransactionType>,
        @InjectRepository(TransactionStatus)
        private readonly transactionStatusRepository: Repository<TransactionStatus>,
        @Inject("KAFKA_CLIENT")
        private readonly clientKafka: ClientKafka,
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

    async onModuleInit() {
        this.clientKafka.subscribeToResponseOf("transaction.validated");
        await this.clientKafka.connect();
    }

    async onModuleDestroy() {
        await this.clientKafka.close();
    }

    async createTransaction(
        newTransaction: NewTransactionDto,
    ): Promise<Transaction> {
        const transaction = this.transactionRepository.create({
            accountExternalIdDebit: newTransaction.accountExternalIdDebit,
            accountExternalIdCredit: newTransaction.accountExternalIdCredit,
            transactionTypeId: newTransaction.tranferTypeId,
            value: newTransaction.value,
            createdAt: new Date(),
        });
        return this.transactionRepository.save(transaction).then((result) => {
            return this.getTransaction(result.transactionExternalId);
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    async updateTransactionStatus(
        transactionId: string,
        status: TransactionStatusesType,
    ): Promise<Transaction> {
        const saved_transaction = await this.getTransaction(transactionId);

        if (saved_transaction === undefined)
            return Promise.reject("Transaction not found, could not update");
        saved_transaction.transactionStatusId = status;
        return this.transactionRepository.save(saved_transaction);
    }

    async getTransaction(transactionExternalId: string): Promise<Transaction> {
        return this.transactionRepository.findOneOrFail({
            where: {
                transactionExternalId: transactionExternalId,
            },
            relations: ["transactionType", "transactionStatus"],
        });
    }

    async sendTransactionForValidation(transaction: Transaction) {
        this.clientKafka.emit("transaction.validate", {
            value: {
                transactionExternalId: transaction.transactionExternalId,
                value: transaction.value,
            } as ValidationRequestDto,
        });
    }

    @MessagePattern("transaction.validated_result")
    onTransactionValidated(@Payload() result: ValidationResultDto) {
        this.updateTransactionStatus(
            result.transactionExternalId,
            result.valid
                ? TransactionStatuses.APPROVED
                : TransactionStatuses.REJECTED,
        );
    }
}
