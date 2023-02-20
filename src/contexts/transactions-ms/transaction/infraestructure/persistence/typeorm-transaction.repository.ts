import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>,
    ) {}
    save(transaction: Transaction): Promise<Transaction> {
        return this.repository.save(transaction);
    }
}
