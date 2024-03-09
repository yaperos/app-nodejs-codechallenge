import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionType } from './transaction-type.entity';

@Injectable()
export class TransactionTypeService {
  constructor(
    @Inject('TRANSACTION_TYPE_REPOSITORY')
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async findById(id: number): Promise<TransactionType> {
    return await this.transactionTypeRepository.findOne({ where: { id } });
  }
}