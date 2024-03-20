import { Injectable } from '@nestjs/common';
import { TransactionEvent } from '../../domain/entities/transaction-verify.event';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import type {
  ISaveTransactionRequest,
  ISaveTransactionResponse,
} from '../../domain/interfaces/transaction.interface';
import { UseCase } from '../../domain/interfaces/use-case.interface';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionProducer } from '../../infrastructure/messaging/producer/transaction.producer';

@Injectable()
export class SaveTransactionUseCase
  implements UseCase<ISaveTransactionRequest, ISaveTransactionResponse>
{
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionProducer: TransactionProducer,
  ) {}

  async execute(
    request: ISaveTransactionRequest,
  ): Promise<ISaveTransactionResponse> {
    const { amount, accountExternalName, transferTypeName } = request;

    const createTransaction = new TransactionEntity({
      amount,
      accountExternalName,
      transferTypeName,
    });

    await this.transactionRepository.create(createTransaction);

    const verifyTransaction = new TransactionEvent(
      createTransaction.amount,
      createTransaction.externalId,
    );

    this.transactionProducer.verifyTransaction(verifyTransaction);

    return createTransaction.toResponse();
  }
}
