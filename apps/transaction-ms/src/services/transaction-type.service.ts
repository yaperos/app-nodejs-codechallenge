import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from '../entities/transaction-type.entity';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private repository: Repository<TransactionType>,
  ) {}

  async findOne(id: number): Promise<TransactionType> {
    return await this.repository.findOne({
      where: { id },
      cache: {
        id: `transaction-type-${id}`,
        milliseconds: 1440 * 60 * 1000,
      },
    });
  }
}
