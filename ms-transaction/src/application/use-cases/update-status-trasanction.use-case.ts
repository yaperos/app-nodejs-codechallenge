import { Injectable } from '@nestjs/common';
import { IUpdateStatusTransactionRequest } from '../../domain/interfaces/transaction.interface';
import { UseCase } from '../../domain/interfaces/use-case.interface';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class UpdateStatusTransactionUseCase
  implements UseCase<IUpdateStatusTransactionRequest, void>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(request: IUpdateStatusTransactionRequest): Promise<void> {
    const { externalId, status } = request;
    await this.transactionRepository.updateStatus(externalId, status);
  }
}
