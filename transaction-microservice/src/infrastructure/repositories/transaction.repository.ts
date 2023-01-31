import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionModel } from "src/domain/model/transaction.model";
import { ITransactionRepository } from "src/domain/repositories/transaction.repository.interface";
import { Repository } from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import TransactionMapper from "../mappers/transaction.mapper";

@Injectable()
export class DataBaseTransactionRepository implements ITransactionRepository{

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ){}


    async insert(transactionModel: TransactionModel): Promise<TransactionModel> {
        const transaction = TransactionMapper.toTransactionEntity(transactionModel);
        const result = await this.transactionRepository.insert(transaction);
        console.log(result.generatedMaps);
        return TransactionMapper.toTransactionModel(result.generatedMaps[0] as Transaction);
    }

    async findByExternalId(externalId: string): Promise<TransactionModel> {
        const transaction = await this.transactionRepository.createQueryBuilder("transaction")
        .leftJoinAndSelect("transaction.type", "transaction_type")
        .leftJoinAndSelect("transaction.status", "transaction_status")
        .where({externalId: externalId}).getOne();
        console.log(transaction);
        return TransactionMapper.toTransactionModel(transaction);
    }
    
}