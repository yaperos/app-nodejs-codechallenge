import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDbEntity } from './transaction-db.entity';
import { Transaction } from '../../../../../transaction/entity/transaction';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TransactionPostgresRepository {
  constructor(
    @InjectRepository(TransactionDbEntity)
    private readonly repository: Repository<TransactionDbEntity>,
    private readonly logger: Logger,
  ) {}

  async save(transaction: Transaction): Promise<void> {
    try {
      this.repository.create(transaction);
      await this.repository.save(transaction);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.logger.error({ error }, 'Error saving transaction');
      throw error;
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    const transactionDbEntity = await this.repository.findOne({
      where: { id },
    });
    if (!transactionDbEntity) {
      return null;
    }
    return Transaction.fromPrimitives({
      ...transactionDbEntity,
    });
  }
}
