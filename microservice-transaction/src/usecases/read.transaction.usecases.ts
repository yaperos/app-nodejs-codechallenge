import { TransactionRepository } from '@/domain/repositories/transaction.repository';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { ILogger } from '@/domain/logger/logger.interface';

export class ReadTransactionUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(): Promise<TransactionEntity[]> {
    const result = await this.transactionRepository.findAll();
    this.logger.log('read all execute', 'all transactions found');
    return result;
  }
}
