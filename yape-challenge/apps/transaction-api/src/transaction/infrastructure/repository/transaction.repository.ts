import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Transaction } from "../../domain/entities/transaction";
import { ITransactionRepository } from "../../domain/repositories/transaction.repository.interface";
@Injectable()
export class TransactionRepository implements ITransactionRepository {

    constructor(@InjectModel(Transaction.name) private readonly transaction: Model<Transaction>) {}

    public async getById(id: string): Promise<Transaction> {
        return await this.transaction.findById(id).exec();
    }
    public async create(entity: Transaction): Promise<Transaction> {
        return await this.transaction.create(entity);
    }
    public async update(entity: Transaction): Promise<Transaction> {
        await this.transaction.replaceOne({ _id: entity._id }, entity, {strict: true});
        return entity;
    }
    public async get(transactionStatus: string, tranferTypeId: number, createdAt: string): Promise<Transaction[]> {
        return await this.transaction.find({ status: transactionStatus, tranferTypeId: tranferTypeId, createdAt: createdAt }).exec();
    }

}