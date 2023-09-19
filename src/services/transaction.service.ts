import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async findOne(id: number): Promise<TransactionEntity | null> {
    return await this.transactionRepository.findOneBy({ id: id })
  }

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    const result = await this.transactionRepository.save(transaction);
    return result;
  }

  async update(transaction: TransactionEntity): Promise<TransactionEntity> {
    const result = await this.transactionRepository.query(
      `UPDATE public.Transaction SET "transactionStatus" = $2 WHERE id = $1 RETURNING *`,
      [transaction.id, transaction.transactionStatus],
    );
    return result[0];
  }
}
