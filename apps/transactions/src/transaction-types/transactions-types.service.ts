import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialTransactionType } from '@transactions/transactions/entities/financial-transaction-type.entity';

@Injectable()
export class TransactionTypesService {
  constructor(
    @InjectRepository(FinancialTransactionType)
    private repository: Repository<FinancialTransactionType>,
  ) {}

  async create(
    entityLike: Partial<FinancialTransactionType>,
  ): Promise<FinancialTransactionType> {
    const entity = this.repository.create(entityLike);

    return await this.repository.save(entity);
  }

  async findAll(): Promise<FinancialTransactionType[]> {
    return await this.repository.find();
  }
}
