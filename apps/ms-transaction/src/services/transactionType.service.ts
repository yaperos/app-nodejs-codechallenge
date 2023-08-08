import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionTypeDto } from '../dto';
import { TransactionType } from '../models';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}
  async save(data: CreateTransactionTypeDto) {
    console.log(' service creating transactionType');

    const transactionType: TransactionType =
      await this.transactionTypeRepository.create(data);
    return this.transactionTypeRepository.save(transactionType);
  }
  async findAll(): Promise<TransactionType[]> {
    return await this.transactionTypeRepository.find();
  }

  findOne(id: number): Promise<TransactionType> {
    return this.transactionTypeRepository.findOneOrFail({
      where: { id },
    });
  }
}
