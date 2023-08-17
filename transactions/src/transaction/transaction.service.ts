import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionStatusIdsEnum } from '../transaction-status/constants/transaction-status-ids.enum';
import { Transaction } from './entities/transaction.entity';
import { TransactionCreatedEvent } from 'shared-library-challenge/build/events/transaction-created.event';
import { Producer } from '../shared/event/Producer';
import { CreateTransferRepository } from './repositories/create-transaction-repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly eventBus: Producer,
    private readonly transactionRepository: TransactionRepository,
    private readonly createTransferRepository: CreateTransferRepository,
  ) {}

  async create(createTransactionDto: Partial<Transaction>) {
    await this.createTransferRepository.start();
    try {
      const transferCreated = await this.createTransferRepository.create({
        ...createTransactionDto,
        transfer_status_id: TransactionStatusIdsEnum.pendingId,
      });
      const event = new TransactionCreatedEvent({
        id_transaction: transferCreated.id_transaction,
        value: transferCreated.value,
      });
      await this.eventBus.emit(event);
      await this.createTransferRepository.commitTransaction();
      return transferCreated;
    } catch (e) {
      await this.createTransferRepository.rollbackTransaction();
      throw e;
    } finally {
      await this.createTransferRepository.release();
    }
  }

  async findOne(id: string) {
    return await this.transactionRepository.getTransactionById(id);
  }

  async updateStatusTransaction(
    idTransaction: string,
    newStatusTransactionId: TransactionStatusIdsEnum,
  ) {
    await this.transactionRepository.updatedStatusOfTransaction(
      idTransaction,
      newStatusTransactionId,
    );
  }
}
