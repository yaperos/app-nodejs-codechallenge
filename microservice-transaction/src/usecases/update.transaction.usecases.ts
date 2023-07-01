import { TransactionRepository } from '@/domain/repositories/transaction.repository';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { ILogger } from '@/domain/logger/logger.interface';

export class UpdateTransactionUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(id: string, status: string): Promise<TransactionEntity> {
    const result = await this.transactionRepository.updateContent(id, status);
    this.logger.log('update execute', 'New transaction have been updated');
    return result;
  }
}
