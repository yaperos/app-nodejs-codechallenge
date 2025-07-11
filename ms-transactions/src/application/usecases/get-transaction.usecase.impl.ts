import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { GetTransactionUseCase } from '../../domain/usecases/get-transaction.usecase';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class GetTransactionUseCaseImpl implements GetTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transactionId: string): Promise<Transaction> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }

    return transaction;
  }
}
