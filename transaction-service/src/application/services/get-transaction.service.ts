import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetTransactionUseCase } from '@ports/in/get-transaction.use-case';
import { TRANSACTION_REPOSITORY } from '@ports/tokens';
import { TransactionRepository } from '@ports/out/transaction-repository';
import { Transaction } from '@domain/transaction';

@Injectable()
export class GetTransactionService implements GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transactionExternalId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByExternalId(
      transactionExternalId,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
