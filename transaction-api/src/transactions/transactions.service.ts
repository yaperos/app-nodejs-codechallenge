import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransaction } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction) private transactionRepository:
        Repository<Transaction>
        ) {}

    findById(id: number): Promise<Transaction> {
        return this.transactionRepository.findOne({
            relations:['transactionStatus', 'transactionType'],
            where: {
                transactionExternalId: id
            }
        });
    }

    create(data: CreateTransaction): Promise<Transaction> {
        const newTransaction = this.transactionRepository.create({
            ...data,
            transactionStatusId: 1,
            transactionTypeId: data.tranferTypeId
        });
        return this.transactionRepository.save(newTransaction);
    }
    update(newState: number, id: number) {
        this.transactionRepository.save({
            transactionExternalId: id,
            transactionStatusId: newState,
        })
    }
}
