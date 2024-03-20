import { Injectable } from '@nestjs/common';
import { TransactionEvent } from '../../domain/entities/transaction-verified.event';
import {
  IVerifyTransactionRequest,
  TransferStatus,
} from '../../domain/interfaces/transaction.interface';
import { UseCase } from '../../domain/interfaces/use-case.interface';
import { TransactionProducer } from '../../infrastructure/messaging/producer/transaction.producer';
import { LoggerService } from '../../infrastructure/services/logger/logger.service';

@Injectable()
export class VerifyTransactionUseCase
  implements UseCase<IVerifyTransactionRequest, void>
{
  constructor(
    private readonly transactionProducer: TransactionProducer,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: IVerifyTransactionRequest): Promise<void> {
    const { amount, externalId } = request;

    const status =
      amount > 1000 ? TransferStatus.REJECTED : TransferStatus.APPROVED;

    const verifiedTransaction = new TransactionEvent(externalId, status);

    this.transactionProducer.verifiedTransaction(verifiedTransaction);
  }
}
