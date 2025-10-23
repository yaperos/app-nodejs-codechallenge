import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../../domain/transactions/transaction.repository'
import { Transaction, CreateTransaction, TRANSACTION_STATUS } from '../../../domain/transactions/transaction';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { Repository } from 'typeorm';



@Injectable()
export class TransactionRepositoryImpl extends TransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly trxRepo: Repository<TransactionEntity>
    ){
        super();
    }

    async findById(id: string): Promise<Transaction | null> {
        const trx = await this.trxRepo.findOne({where: { transactionExternalId: id }})
        return trx ? this.toDomain(trx) : null  
    }

    async create(transaction: CreateTransaction): Promise<Transaction> {
        const entity = await this.trxRepo.save(transaction)
        return this.toDomain(entity)
    }

    async updateStatus(id: string, status: TRANSACTION_STATUS): Promise<Transaction> {
        const trx = await this.trxRepo.findOne({where: { transactionExternalId: id }})
        if (!trx) throw new Error('Transaction not found');
        trx.transactionStatus = status;
        const updated = await this.trxRepo.save(trx)
        return this.toDomain(updated)
    }


    private toDomain(row: TransactionEntity): Transaction {
        return new Transaction(
            row.transactionExternalId,
            row.accountExternalIdDebit,
            row.accountExternalIdCredit,
            row.tranferTypeId,
            row.transactionStatus,
            row.value,
            row.createdAt
        )
    }
}