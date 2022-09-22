import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async create(body: any) {
    const transaction = this.repository.create(body);
    await this.repository.insert(transaction);
    return transaction;
  }

  async findOne(id: string) {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity;
  }

  async find() {
    return this.repository.find({});
  }
}
