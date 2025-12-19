import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { Transaction } from '../entity/transaction';
import { Logger } from 'nestjs-pino';

@Injectable()
export class GetTransactionsService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionDbRepo: TransactionPostgresRepository,
    private readonly logger: Logger,
  ) {}

  async getById(id: string): Promise<Transaction> {
    const transaction = await this.transactionDbRepo.findById(id);
    if (!transaction) {
      this.logger.warn({ transactionId: id }, 'Transaction not found');
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
