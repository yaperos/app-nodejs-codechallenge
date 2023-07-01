import { TransactionRepository } from '@/domain/repositories/transaction.repository';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { ILogger } from '@/domain/logger/logger.interface';

export class CreateTransactionUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(transaction: TransactionEntity): Promise<TransactionEntity> {
    const result = await this.transactionRepository.insert(transaction);
    this.logger.log('create execute', 'New transaction have been inserted');
    return result;
  }
}
