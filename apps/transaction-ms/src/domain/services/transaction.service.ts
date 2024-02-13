import { TransactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '../model/transaction.model';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import {
  Status,
  StatusStrings,
  TRANSACTION_CREATED,
} from '@app/common/constants';
import { Token } from '../../infrastructure/constants';
import { TransactionTypeService } from './transaction-type.service';
import { ClientKafka, KafkaRetriableException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RequestData, TransactionEvent } from '@app/common/interfaces';

export class TransactionService {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    @Inject(Token.TRANSACTION_TYPE)
    private readonly transactionTypeService: TransactionTypeService,
    @Inject(Token.TRANSACTION_CLIENT) private transactionSender: ClientKafka,
  ) {}

  async getOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new NotFoundException();
    }
    return transaction;
  }

  async create(transactionData: Transaction): Promise<Transaction> {
    transactionData.status = Status.PENDING;

    try {
      await this.transactionTypeService.findOne(
        transactionData.transactionTypeId,
      );
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new BadRequestException(
          `Transaction type ${transactionData.transactionTypeId} is invalid`,
        );
      }
      throw e;
    }

    return await this.transactionRepo.save(transactionData);
  }

  async updateStatusById(id: string, status: StatusStrings): Promise<void> {
    try {
      await this.transactionRepo.updateStatusById(id, status);
    } catch (e) {
      throw new KafkaRetriableException(e.message);
    }
  }

  async emitNewTransactionNotification(transaction: Transaction) {
    await lastValueFrom(
      this.transactionSender.emit<string, RequestData<TransactionEvent>>(
        TRANSACTION_CREATED,
        {
          payload: {
            transactionId: transaction.id,
            amount: transaction.amount,
            status: transaction.status,
            sent: new Date(),
          },
        },
      ),
    );
  }
}
