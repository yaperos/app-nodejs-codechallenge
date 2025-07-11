import { Injectable, Inject } from '@nestjs/common';
import { UpdateTransactionStatusUseCase } from '../../domain/usecases/update-transaction-status.usecase';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionStatus } from '../../domain/enums/transaction.enums';

@Injectable()
export class UpdateTransactionStatusUseCaseImpl
  implements UpdateTransactionStatusUseCase
{
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(
    transactionExternalId: string,
    status: TransactionStatus,
  ): Promise<void> {
    await this.transactionRepository.updateStatus(
      transactionExternalId,
      status,
    );
  }
}
