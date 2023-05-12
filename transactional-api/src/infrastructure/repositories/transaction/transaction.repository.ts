import { Injectable } from "@nestjs/common";
import { Transaction } from "src/domain/entities/transaction.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { ITransactionRepository } from "src/domain/interfaces/itransaction.repository";

@Injectable()
export class TransactionRepository implements ITransactionRepository{

    constructor(
        @InjectRepository(Transaction) 
        private TransactionCtx: Repository<Transaction>
    ){}

    async searchByAsync(prmTransactionExternalId: string): Promise<Transaction>{
        return await this.TransactionCtx.findOne({
            select: {
                transactionExternalId: true,
                transactionType: true,
                transactionStatus: true,
                value: true,
                createDateTime: true
            },
            where: {
                transactionExternalId: prmTransactionExternalId,
                isActive: true
            }
        });
    }

    async saveAsync(item: Transaction): Promise<Transaction>{
        return await this.TransactionCtx.save(item);
    }

}