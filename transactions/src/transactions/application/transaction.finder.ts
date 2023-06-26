import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '@transactions/domain/transaction.entity';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';

@Injectable()
export class TransactionFinder {
  constructor(private repository: TransactionRepository) {}

  public async run(id: string): Promise<Transaction> {
    const transaction = await this.repository.findById(id);

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return transaction;
  }
}
