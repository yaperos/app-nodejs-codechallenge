import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialTransaction } from '@/transactions/entities/financial-transaction.entity';
import { FinancialTransactionStatuses } from '@/transactions/enums/financial-transaction-statuses.enum';

@Injectable()
export class FinancialTransactionsService {
  constructor(
    @InjectRepository(FinancialTransaction)
    private repository: Repository<FinancialTransaction>,
  ) {}

  async create(
    entityLike: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction> {
    const entity = this.repository.create({
      ...entityLike,
      transactionStatus: FinancialTransactionStatuses.pending,
      createdAt: new Date(),
    });

    return await this.repository.save(entity);
  }

  async findAll(): Promise<FinancialTransaction[]> {
    return await this.repository.find({
      relations: { transactionType: true },
    });
  }

  async getOne(id: number): Promise<FinancialTransaction> {
    return await this.repository.findOne({
      relations: { transactionType: true },
      where: { transactionId: id },
    });
  }

  async updateSatus(
    entityLike: Partial<FinancialTransaction>,
  ): Promise<FinancialTransaction> {
    const incoming = this.repository.create(entityLike);
    const existing = await this.getOne(incoming.transactionId);

    const entity = this.repository.merge(existing, {
      transactionStatus: incoming.transactionStatus,
      transactionExternalId: incoming.transactionExternalId,
    });

    return await this.repository.save(entity);
  }
}
