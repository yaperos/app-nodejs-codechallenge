import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { ITransactionPayload } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private repository: Repository<TransactionEntity>,
  ) {}

  public async createTransactions(
    transactions: CreateTransactionDto[],
  ): Promise<TransactionEntity[]> {
    await this.repository.insert(transactions);
    return await this.getTransactions();
  }

  public async getTransactions(): Promise<TransactionEntity[]> {
    return await this.repository.find();
  }

  public async findById(id: string): Promise<TransactionEntity> {
    return await this.repository.findOne({ where: { id } });
  }

  public async findByTransactionId(id: string): Promise<TransactionEntity> {
    return await this.repository.findOne({
      where: [
        { accountExternalIdCredit: id },
        { accountExternalIdDebit: id },
        { id },
      ],
    });
  }

  public async updateTransaction(
    params: ITransactionPayload,
  ): Promise<TransactionEntity> {
    await this.repository.update({ id: params.id }, { status: params.status });
    return await this.findById(params.id);
  }
}
