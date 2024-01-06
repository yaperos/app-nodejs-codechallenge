import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionTypeEntity } from '../entities/transactions-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsTypesService {
  constructor(
    @InjectRepository(TransactionTypeEntity)
    private transactionsTypesRepository: Repository<TransactionTypeEntity>,
  ) {}
  async findOne(id: number) {
    return await this.transactionsTypesRepository.findOneBy({ id });
  }
}
