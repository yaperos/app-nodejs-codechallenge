import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { UpdateStatusTransactionDto } from '../infrastructure/dtos/update-status-transaction.dto';

@Injectable()
export class UpdateStatusTransactionService {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(data: UpdateStatusTransactionDto): Promise<void> {
    await this.transactionRepository.updateStatus(data.id, data.status);
  }
}
