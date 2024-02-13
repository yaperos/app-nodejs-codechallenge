import { ConfigService } from '@nestjs/config';
import { TransactionType } from '../../domain/model/transaction.model';
import { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionTypeMemoryRepository
  implements TransactionTypeRepository
{
  constructor(private configService: ConfigService) {}

  findById(id: number): TransactionType {
    const transactionType =
      this.configService.get<TransactionType[]>('transactionTypes');

    return transactionType.find((type) => type.id === id);
  }

  findAll(): TransactionType[] {
    throw new Error('Method not implemented.');
  }
}
