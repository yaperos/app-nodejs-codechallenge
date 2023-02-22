import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TransactionModel } from '../../../domain/transaction.model';
import { TransactionRepository } from '../../../domain/transaction.repository';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>,
    ) {}

    async save(transactionModel: TransactionModel): Promise<TransactionModel> {
        const transaction = plainToInstance(Transaction, transactionModel);
        const transactionCreated = await this.repository.save(transaction);
        return plainToInstance(TransactionModel, transactionCreated);
    }
}
