import { TRANSACTION_STATUS } from '@app/common/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-trasaction.dto';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.repository.create(data);
    await this.repository.insert(transaction);
    return transaction;
  }

  async findOne(id: string) {
    const entity = await this.repository.findOne({
      where: { transactionExternalId: id },
    });

    return entity;
  }

  async find() {
    return this.repository.find({});
  }

  async updateStatusById(id: string, status: TRANSACTION_STATUS) {
    const transaction = this.repository.findOne({
      where: { transactionExternalId: id },
    });
    if (transaction) {
      await this.repository.update(id, { status });
    }

    return transaction;
  }
}
