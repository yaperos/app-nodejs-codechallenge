import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TransactionType } from '../entities';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async getAllTransactionsType(): Promise<TransactionType[]> {
    return this.transactionTypeRepository.find();
  }

  async getTransactionType(id: number): Promise<TransactionType> {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  async newTransactionType(body: {
    typeName: string;
  }): Promise<TransactionType> {
    const { typeName } = body;
    try {
      const newTransactionType = this.transactionTypeRepository.create({
        typeName,
      });

      return this.transactionTypeRepository.save(newTransactionType);
    } catch (err) {
      throw new Error(`Error when creating the transaction type: ${err}`);
    }
  }

  async DeleteAllTypes(): Promise<void> {
    await this.transactionTypeRepository.clear();
  }
}
