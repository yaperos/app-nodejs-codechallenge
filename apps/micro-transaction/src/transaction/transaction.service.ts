import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { Transaction } from "./entities/transaction";
import { TransactionStatus as Status } from "./constants/transactionstatus.enum";
import { TransactionType as Type } from "./constants/transactiontype.enum";
import { Repository } from "typeorm";
import { KafkaService } from "../kafka/kafka.service";
import { AntiFraudMessage } from "./entities/antiFraud.message";
import { StatusService } from "./status.service";

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly kafkaService: KafkaService,
        private readonly statusServide: StatusService
    ) {}

    async findById(id: string): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOneBy({ transactionExternalId: id });
        const type = await this.statusServide.findTypeById(transaction.transactionTypeId);
        const status = await this.statusServide.findStatusById(transaction.transactionStatusId);

        return {
            ...transaction,
            transactionType: type,
            transactionStatus: status,
        };
    }

    async findAll(): Promise<Transaction[]> {
        return await this.transactionRepository.find();
    }

    async create(transactionInput: CreateTransactionInput): Promise<Transaction> {
        const transactionType: number = transactionInput.accountExternalIdCredit ? Type.CREDIT : Type.DEBIT
        const transaction: Transaction = this.transactionRepository.create(transactionInput)
        transaction.transactionStatusId = Status.PENDING
        transaction.transactionTypeId = transactionType
        const newTransaction = await this.transactionRepository.save(transaction)

        await this.kafkaService.antiFraudValidation({
            transactionExternalId: newTransaction.transactionExternalId,
            transactionStatusId: newTransaction.transactionStatusId,
            amount: newTransaction.value
        });

        return newTransaction;
    }

    async updateTransactionStatus(payload: AntiFraudMessage): Promise<void> {
        const { transactionExternalId, transactionStatusId } = payload

        await this.transactionRepository.update({
            transactionExternalId,
        }, {
            transactionStatusId
        });
    }
}
