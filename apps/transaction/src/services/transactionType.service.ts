import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionTypeInput } from '../dto/create-transaction.input';
import { TransactionType } from '../entities/transactionType.entity';

@Injectable()
export class TransactionTypeervice {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async create(data: TransactionTypeInput) {
    const transaction = this.transactionTypeRepository.create(data);
    return await this.transactionTypeRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionTypeRepository.find();
  }

  async findById(id: string) {
    return await this.transactionTypeRepository.findOne({
      where: { id },
    });
  }
}
