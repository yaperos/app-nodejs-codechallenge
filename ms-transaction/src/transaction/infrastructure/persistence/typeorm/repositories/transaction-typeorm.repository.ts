import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { TransactionRepository } from '../../../../domain/repositories/transaction.repository';
import { TransactionModel } from '../../../../domain/models/transaction.model';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';

@Injectable()
export class TransactionTypeormRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async save(transaction: TransactionModel): Promise<void> {
    const entity = plainToClass(TransactionEntity, transaction);
    await this.repository.save(entity);
  }

  async getById(id: string): Promise<TransactionModel | null> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) return null;

    const transaction = plainToClass(TransactionModel, entity);
    return transaction;
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
