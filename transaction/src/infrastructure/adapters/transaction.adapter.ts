import { TransactionRepository } from "src/domain/repositories/transaction.repository";
import { Transaction } from "src/domain/transaction";
import { TransactionEntity } from "../entities/transaction.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionUtils } from "src/shared/transaction-utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionAdapter implements TransactionRepository{

    constructor(
        @InjectRepository(TransactionEntity)
        private transactionEntityRepository: Repository<TransactionEntity>
        // private transactionEntityRepository: any
      ) {}

    async getById(transactionExternalId: string): Promise<Transaction> {
        const transactionEntity = await this.transactionEntityRepository.findOneBy({transactionExternalId});
        return TransactionUtils.fromTransactionEntityToTransaction(transactionEntity);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        const transactionEntity = TransactionUtils.fromTransactionToTransactionEntity(transaction);
        const transactionSaved = await this.transactionEntityRepository.save(transactionEntity);
        return TransactionUtils.fromTransactionEntityToTransaction(transactionSaved);
    }    

    async update(transactionExternalId: string, properties: object): Promise<Transaction> {
        let transactionEntity = await this.transactionEntityRepository.findOneBy({transactionExternalId});
        transactionEntity = {...transactionEntity, ...properties};
        console.log("transactionEntity:", transactionEntity);
        const transactionUpdated = await this.transactionEntityRepository.save(transactionEntity);
        return TransactionUtils.fromTransactionEntityToTransaction(transactionUpdated);
    } 
}