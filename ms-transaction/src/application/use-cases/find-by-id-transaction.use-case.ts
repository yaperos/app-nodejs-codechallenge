import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { UseCase } from '../../domain/interfaces/use-case.interface';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ExceptionsService } from '../../infrastructure/services/exceptions/exceptions.service';
import { LoggerService } from '../../infrastructure/services/logger/logger.service';
import type { Optional } from 'src/shared/utils/optional';

@Injectable()
export class FindByIdTransactionUseCase
  implements UseCase<string, TransactionEntity>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly exceptionService: ExceptionsService,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(externalId: string): Promise<Optional<TransactionEntity>> {
    const findTransaction =
      await this.transactionRepository.findByExternalId(externalId);
    if (!findTransaction) {
      this.loggerService.error('Transaction not exist', externalId);
      this.exceptionService.notFoundException({
        message: 'Transaction not exist',
      });
    }
    return findTransaction;
  }
}
