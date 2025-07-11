import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { CreateTransactionDto } from '../../domain/dto/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { OutboxEventRepository } from '../../domain/repositories/outbox-event.repository';
import { RepositoryTransactionContext } from '../../domain/repositories/transaction-context';
import {
  TransactionStatus,
  TransactionType,
} from '../../domain/enums/transaction.enums';
import { v4 as uuidv4 } from 'uuid';
import Decimal from 'decimal.js';
import { CachedTransactionMapper } from '../../domain/mappers/cached-transaction.mapper';

@Injectable()
export class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepository,
    @Inject('OutboxEventRepository')
    private readonly outboxEventRepository: OutboxEventRepository,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.dataSource.transaction(async (manager) => {
      const transactionContext: RepositoryTransactionContext = {
        transactionManager: manager,
      };

      const transaction = new Transaction();
      transaction.id = uuidv4();
      transaction.accountDebit = createTransactionDto.accountExternalIdDebit;
      transaction.accountCredit = createTransactionDto.accountExternalIdCredit;
      transaction.transferType = this.mapTransferTypeIdToEnum(
        createTransactionDto.tranferTypeId,
      );
      transaction.status = TransactionStatus.PENDING;
      transaction.value = new Decimal(createTransactionDto.value);
      transaction.createdAt = new Date();

      const savedTransaction = await this.transactionRepository.create(
        transaction,
        transactionContext,
      );

      const outboxEvent = {
        eventType: 'TRANSACTION_CREATED',
        payload: {
          transactionExternalId: savedTransaction.id,
          accountExternalIdDebit: savedTransaction.accountDebit,
          accountExternalIdCredit: savedTransaction.accountCredit,
          tranferTypeId: createTransactionDto.tranferTypeId,
          value: savedTransaction.value,
          createdAt: savedTransaction.createdAt,
        },
        aggregateId: savedTransaction.id,
        processed: false,
      };

      await this.outboxEventRepository.create(outboxEvent, transactionContext);

      await this.cacheManager.set(
        `transaction:${savedTransaction.id}`,
        CachedTransactionMapper.toDTO(savedTransaction),
        3600,
      );

      return savedTransaction;
    });
  }

  private mapTransferTypeIdToEnum(transferTypeId: number): TransactionType {
    switch (transferTypeId) {
      case 1:
        return TransactionType.TRANSFER;
      case 2:
        return TransactionType.PAYMENT;
      case 3:
        return TransactionType.DEPOSIT;
      default:
        return TransactionType.TRANSFER;
    }
  }
}
