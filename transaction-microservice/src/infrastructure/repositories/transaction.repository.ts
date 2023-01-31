import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { TransactionModel } from "src/domain/model/transaction.model";
import { ITransactionRepository } from "src/domain/repositories/transaction.repository.interface";
import { Repository } from "typeorm";
import { TransactionStatus } from "../entities/transaction-status.entity";
import { TransactionType } from "../entities/transaction-type.entity";
import { Transaction } from "../entities/transaction.entity";
import TransactionMapper from "../mappers/transaction.mapper";

@Injectable()
export class DataBaseTransactionRepository implements ITransactionRepository{

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(TransactionType)
        private readonly transactionTypeRepository: Repository<TransactionType>,
        @InjectRepository(TransactionStatus)
        private readonly transactionStatusRepository: Repository<TransactionStatus>
    ){}


    async insert(transactionModel: TransactionModel): Promise<TransactionModel> {
        let transaction = TransactionMapper.toTransactionEntity(transactionModel);
        transaction.externalId = randomUUID();
        transaction.status = await this.transactionStatusRepository.findOne({where: {description: 'Pendiente'}});
        transaction.type = await this.transactionTypeRepository.findOne({where: {id: transaction.type.id}});

        const result = await this.transactionRepository.insert(transaction);
        transaction = Object.assign(transaction, result.generatedMaps[0]) as Transaction;
        return TransactionMapper.toTransactionModel(transaction);
    }

    async findByExternalId(externalId: string): Promise<TransactionModel> {
        const transaction = await this.transactionRepository.findOne({where: {externalId: externalId}, relations: { type: true, status: true}}) 
        return TransactionMapper.toTransactionModel(transaction);
    }
    
}