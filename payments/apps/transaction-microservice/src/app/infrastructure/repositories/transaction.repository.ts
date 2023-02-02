import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StatusInterface, TransactionModel } from "@payments/shared/model";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface";
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
    
    async update(transactionModel: TransactionModel): Promise<TransactionModel> {
        let remoteTransactionModel = await this.findByExternalId(transactionModel.externalId);
        remoteTransactionModel.status = await this.transactionStatusRepository.findOne({where: {description: transactionModel.status.description}});
        remoteTransactionModel.statusId =  remoteTransactionModel.status.id;
        let transaction = TransactionMapper.toTransactionEntity(remoteTransactionModel);
        const result = await this.transactionRepository.save(transaction);
        return TransactionMapper.toTransactionModel(transaction);
    }

    async insert(transactionModel: TransactionModel): Promise<TransactionModel> {
        let transaction = TransactionMapper.toTransactionEntity(transactionModel);
        transaction.externalId = randomUUID();
        transaction.status = await this.transactionStatusRepository.findOne({where: {description: StatusInterface.PENDING}});
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