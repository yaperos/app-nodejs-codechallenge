import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { TransactionStatus } from '../entity/transaction-status.enum';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UpdateTransactionsService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionDbRepo: TransactionPostgresRepository,
    private readonly logger: Logger,
  ) {}

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    const transaction = await this.transactionDbRepo.findById(id);
    if (!transaction) {
      this.logger.warn({ transactionId: id }, 'Transaction not found');
      throw new NotFoundException('Transaction not found');
    }
    this.logger.debug({ transaction }, 'Transaction found for update');
    transaction.updateStatus(status);
    await this.transactionDbRepo.save(transaction);
  }
}
