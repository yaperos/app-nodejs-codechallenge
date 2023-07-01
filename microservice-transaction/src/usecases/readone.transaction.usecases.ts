import { TransactionRepository } from '@/domain/repositories/transaction.repository';
import { TransactionEntity } from '@/domain/model/transaction.model';
import { ILogger } from '@/domain/logger/logger.interface';

export class ReadOneTransactionUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(id: string): Promise<TransactionEntity> {
    const result = await this.transactionRepository.findById(id);
    this.logger.log('get one execute', 'Transaction by uuid found');
    return result;
  }
}
