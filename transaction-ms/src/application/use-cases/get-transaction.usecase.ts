import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';

@Injectable()
export class GetTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(transactionExternalId: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findById(transactionExternalId);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionExternalId} not found.`);
    }
    return transaction;
  }
}
