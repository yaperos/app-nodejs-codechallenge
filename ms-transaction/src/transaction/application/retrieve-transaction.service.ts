import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { TransactionDescription } from '../domain/interfaces/transaction-description.interface';

@Injectable()
export class RetrieveTransactionService {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(id: string): Promise<TransactionDescription> {
    const transaction = await this.transactionRepository.getById(id);

    if (!transaction) throw new Error('Invalid transaction');

    const descriptionTransaction = transaction.toDescriptionObject();

    return descriptionTransaction;
  }
}
