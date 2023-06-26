import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionStatus,
} from '@transactions/domain/transaction.entity';
import { TransactionRequestDto } from '@transactions/infrastructure/dtos/transaction-request.dto';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';

@Injectable()
export class TransactionCreator {
  constructor(private repository: TransactionRepository) {}

  public async run(
    transactionDto: TransactionRequestDto,
  ): Promise<Transaction> {
    const transaction: Transaction = {
      ...transactionDto,
      id: uuidv4(),
      externalId: uuidv4(),
      status: TransactionStatus.Pending,
      createdAt: new Date(),
    };

    await this.repository.save(transaction);
    return transaction;
  }
}
