// apps/auth-microservice/src/app/users.repository.ts

import { Injectable } from '@nestjs/common';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';
import { v4 as uuid } from 'uuid';
import { CreateTransactionDto } from '@app-nodejs-codechallenge/shared/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';


@Injectable()
export class TransactionRepository {
  private readonly transactions: Transaction[] = [];
  private readonly transactionType = ['deposit', 'withdrawal'];

  constructor(
    @InjectRepository(Transaction)
    private readonly repository: MongoRepository<Transaction>,
  ) {}

  save(transaction: CreateTransactionDto) {
    const id: string = uuid();
   const newTransaction = {
      transactionType: this.transactionTypeById(transaction.tranferTypeId),
      transactionStatus: 'pending',
      value: transaction.value,
      createdAt: new Date(),
    };
    return this.repository.save(newTransaction);
  }

  update(transaction: Transaction) {
    return this.repository.save(transaction);
  }

  findOne(id: string) {
    return this.transactions.find((u) => u.transactionExternalId === id) || null;
  }

  private transactionTypeById(tranferTypeId: number) {
    const index = this.transactionType.findIndex((t, i) => i === tranferTypeId);
    return index === -1 ? this.transactionType[0] : this.transactionType[index];
  }
}