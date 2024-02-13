import { NotFoundException } from '@nestjs/common';
import { TransactionType } from '../model/transaction.model';
import { TransactionTypeRepository } from '../repositories/transaction-type.repository';

export class TransactionTypeService {
  constructor(
    private readonly transactionTypeRepo: TransactionTypeRepository,
  ) {}

  async findOne(id: number): Promise<TransactionType> {
    const transactionType = await this.transactionTypeRepo.findById(id);

    if (!transactionType) {
      throw new NotFoundException();
    }
    return transactionType;
  }
}
