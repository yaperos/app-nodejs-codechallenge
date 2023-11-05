import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { TransactionEntity } from './transaction.entity';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { StatusesEnum } from 'src/transaction/domain/enum/transaction.statuses';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async create(transaction: DomainCreateTransactionDto): Promise<Transaction> {
    return await this.repository.save(transaction);
  }

  async updateStatus(id: number, status: StatusesEnum): Promise<Transaction> {
    await this.repository.save({ id, status });
    return await this.getById(id);
  }

  async getById(id: number): Promise<Transaction> {
    const data = await this.repository.findOneBy({ id });
    if (!data) {
      throw new Error('No existe el recurso');
    }
    return data;
  }
}
