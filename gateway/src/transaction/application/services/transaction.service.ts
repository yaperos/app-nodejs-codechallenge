import { Inject, Injectable } from '@nestjs/common';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { TransactionServiceInterface } from 'src/transaction/domain/interfaces/transaction.service.interface';

@Injectable()
export class TransactionServiceImpl implements TransactionServiceInterface {
  constructor(
    @Inject('TransactionRepository')
    private readonly repository: TransactionRepositoryInterface,
  ) {}

  async create(transaction: DomainCreateTransactionDto) {
    await this.repository.create(transaction);
  }
}
