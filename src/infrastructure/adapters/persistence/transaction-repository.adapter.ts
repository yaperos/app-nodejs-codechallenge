import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryPort } from '@domain/ports/transaction-repository.port';
import { TransactionEntity } from '@domain/entities/transaction.entity';
import { TransactionOrmEntity } from './entities/transaction.entity';
import { TransactionPersistenceMapper } from './mappers/transaction-persistence.mapper';

@Injectable()
export class TransactionRepositoryAdapter implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const ormEntity = TransactionPersistenceMapper.toOrm(transaction);
    const savedEntity = await this.transactionRepository.save(ormEntity);
    
    // Reload with relations
    const reloadedEntity = await this.transactionRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['transactionType', 'transactionStatus'],
    });

    if (!reloadedEntity) {
      throw new Error('Failed to reload saved transaction');
    }

    return TransactionPersistenceMapper.toDomain(reloadedEntity);
  }

  async findByExternalId(transactionExternalId: string): Promise<TransactionEntity | null> {
    const ormEntity = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      relations: ['transactionType', 'transactionStatus'],
    });

    if (!ormEntity) {
      return null;
    }

    return TransactionPersistenceMapper.toDomain(ormEntity);
  }

  async updateStatus(transactionExternalId: string, status: string): Promise<void> {
    const statusId = TransactionPersistenceMapper.getStatusIdByName(status);
    
    await this.transactionRepository.update(
      { transactionExternalId },
      { statusId, updatedAt: new Date() },
    );
  }
} 