import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionType } from '../../../database/entities/transaction-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionTypeDBService {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async findTransactionTypeById(id: number): Promise<TransactionType> {
    const result = await this.transactionTypeRepository.findOne({
      where: {
        id,
      },
    });
    return result;
  }
}
