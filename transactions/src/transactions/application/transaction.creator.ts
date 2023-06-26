import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionStatus,
} from '@transactions/domain/transaction.entity';
import { TRANSACTION_CREATED } from '@transactions/domain/transaction.event';
import { TransactionRequestDto } from '@transactions/infrastructure/dtos/transaction-request.dto';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';
import { MessageBus } from './../../shared/message-bus.service';

@Injectable()
export class TransactionCreator {
  constructor(
    private repository: TransactionRepository,
    private messageBus: MessageBus<Partial<Transaction>, TransactionStatus>,
  ) {}

  public async run(
    transactionDto: TransactionRequestDto,
  ): Promise<Transaction> {
    const transaction: Transaction = {
      ...transactionDto,
      id: uuidv4(),
      externalId: uuidv4(),
      status: TransactionStatus.Pending,
      createdAt: new Date(),
    };

    await this.repository.save(transaction);
    const transactionStatus = await this.messageBus.send(TRANSACTION_CREATED, {
      id: transaction.id,
      value: transaction.value,
    });
    await this.repository.update(transaction.id, { status: transactionStatus });

    return {
      ...transaction,
      status: transactionStatus,
    };
  }
}
