import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, MoreThan, Between } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  private manager: EntityManager | null = null;

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const entity = this.toEntity(transaction);
    const saved = await this.getRepository().save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.getRepository().findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByExternalId(externalId: string): Promise<Transaction | null> {
    const entity = await this.getRepository().findOne({ where: { externalId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByIdempotencyKey(key: string): Promise<Transaction | null> {
    const entity = await this.getRepository().findOne({
      where: { idempotencyKey: key },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByAccountId(
    accountId: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Transaction[]> {
    const entities = await this.getRepository()
      .createQueryBuilder('transaction')
      .where(
        '(transaction.sourceAccountId = :accountId OR transaction.targetAccountId = :accountId)',
        { accountId },
      )
      .orderBy('transaction.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async findByStatus(status: string, limit: number = 100): Promise<Transaction[]> {
    const entities = await this.getRepository().find({
      where: { status: status.toUpperCase() as TransactionStatus },
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findFailedTransactionsForRetry(limit: number): Promise<Transaction[]> {
    const entities = await this.getRepository()
      .createQueryBuilder('transaction')
      .where('transaction.status = :status', { status: TransactionStatus.FAILED })
      .andWhere('transaction.retryCount < :maxRetries', { maxRetries: 3 })
      .andWhere("transaction.antifraudStatus != 'REJECTED'")
      .orderBy('transaction.updatedAt', 'ASC')
      .limit(limit)
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const entity = this.toEntity(transaction);
    const updated = await this.getRepository().save(entity);
    return this.toDomain(updated);
  }

  async countByStatus(
    status: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const query = this.getRepository()
      .createQueryBuilder('transaction')
      .where('transaction.status = :status', { status: status.toUpperCase() });

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getCount();
  }

  async getTotalAmountByStatus(
    status: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const query = this.getRepository()
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .where('transaction.status = :status', { status: status.toUpperCase() });

    if (startDate && endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const result = await query.getRawOne();
    return result?.total || 0;
  }

  async beginTransaction(): Promise<void> {
    this.manager = this.repository.manager;
    await this.manager.query('BEGIN');
  }

  async commitTransaction(): Promise<void> {
    if (this.manager) {
      await this.manager.query('COMMIT');
      this.manager = null;
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this.manager) {
      await this.manager.query('ROLLBACK');
      this.manager = null;
    }
  }

  private getRepository(): Repository<TransactionEntity> {
    return this.manager ? this.manager.getRepository(TransactionEntity) : this.repository;
  }

  private toDomain(entity: TransactionEntity): Transaction {
    return new Transaction({
      id: entity.id,
      externalId: entity.externalId,
      type: entity.type,
      amount: Number(entity.amount),
      currency: entity.currency,
      sourceAccountId: entity.sourceAccountId,
      targetAccountId: entity.targetAccountId,
      status: entity.status,
      metadata: entity.metadata,
      antifraudScore: entity.antifraudScore || undefined,
      antifraudStatus: entity.antifraudStatus || undefined,
      antifraudCheckedAt: entity.antifraudCheckedAt || undefined,
      retryCount: entity.retryCount,
      idempotencyKey: entity.idempotencyKey || undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      completedAt: entity.completedAt || undefined,
      failureReason: entity.failureReason || undefined,
      reversedAt: entity.reversedAt || undefined,
      reversalTransactionId: entity.reversalTransactionId || undefined,
    });
  }

  private toEntity(domain: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = domain.id;
    entity.externalId = domain.externalId;
    entity.type = domain.type;
    entity.amount = domain.amount;
    entity.currency = domain.currency;
    entity.sourceAccountId = domain.sourceAccountId;
    entity.targetAccountId = domain.targetAccountId;
    entity.status = domain.status;
    entity.metadata = domain.metadata;
    entity.antifraudScore = domain.antifraudScore || null;
    entity.antifraudStatus = domain.antifraudStatus || null;
    entity.antifraudCheckedAt = domain.antifraudCheckedAt || null;
    entity.retryCount = domain.retryCount;
    entity.idempotencyKey = domain.idempotencyKey || null;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.completedAt = domain.completedAt || null;
    entity.failureReason = domain.failureReason || null;
    entity.reversedAt = domain.reversedAt || null;
    entity.reversalTransactionId = domain.reversalTransactionId || null;
    return entity;
  }
}