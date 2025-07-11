import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { RepositoryTransactionContext } from '../../domain/repositories/transaction-context';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionStatus } from '../../domain/enums/transaction.enums';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async create(
    transaction: Transaction,
    context?: RepositoryTransactionContext,
  ): Promise<Transaction> {
    const manager = context?.transactionManager || this.repository.manager;

    const entity = manager.create(TransactionEntity, {
      transactionExternalId: transaction.id,
      accountExternalIdDebit: transaction.accountDebit,
      accountExternalIdCredit: transaction.accountCredit,
      transactionType: transaction.transferType,
      transactionStatus: transaction.status,
      value: transaction.value,
      tranferTypeId: this.mapTransferTypeToId(transaction.transferType),
      createdAt: transaction.createdAt,
    });

    const savedEntity = await manager.save(entity);
    return this.mapToDomain(savedEntity);
  }

  async findById(
    id: string,
    context?: RepositoryTransactionContext,
  ): Promise<Transaction | null> {
    const manager = context?.transactionManager || this.repository.manager;

    const entity = await manager.findOne(TransactionEntity, {
      where: { transactionExternalId: id },
    });

    return entity ? this.mapToDomain(entity) : null;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    context?: RepositoryTransactionContext,
  ): Promise<void> {
    const manager = context?.transactionManager || this.repository.manager;

    await manager.update(
      TransactionEntity,
      { transactionExternalId: id },
      { transactionStatus: status },
    );
  }

  private mapToDomain(entity: TransactionEntity): Transaction {
    const transaction = new Transaction();
    transaction.id = entity.transactionExternalId;
    transaction.accountDebit = entity.accountExternalIdDebit;
    transaction.accountCredit = entity.accountExternalIdCredit;
    transaction.transferType = entity.transactionType;
    transaction.status = entity.transactionStatus;
    transaction.value = entity.value;
    transaction.createdAt = entity.createdAt;
    return transaction;
  }

  private mapTransferTypeToId(transferType: string): number {
    switch (transferType) {
      case 'Transfer':
        return 1;
      case 'Payment':
        return 2;
      case 'Deposit':
        return 3;
      default:
        return 1;
    }
  }
}
