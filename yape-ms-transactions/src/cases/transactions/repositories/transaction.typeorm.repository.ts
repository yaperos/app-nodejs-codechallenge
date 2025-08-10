import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Project */
import { TransactionEntity, Transaction } from '../models';
import { ITransactionRepository } from './transaction.repository';

@Injectable()
export class TypeormTransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly ormRepo: Repository<TransactionEntity>,
  ) {}

  private toDomain(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      accountExternalIdDebit: entity.accountExternalIdDebit,
      accountExternalIdCredit: entity.accountExternalIdCredit,
      transferTypeId: entity.transferTypeId,
      value: entity.value,
      transactionStatusName: entity.transactionStatusName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  async save(data: Partial<Transaction>): Promise<Transaction> {
    const entity = this.ormRepo.create({
      id: data.id,
      accountExternalIdDebit: data.accountExternalIdDebit,
      accountExternalIdCredit: data.accountExternalIdCredit,
      transferTypeId: data.transferTypeId,
      value: data.value,
      transactionStatusName: data.transactionStatusName,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ?? null,
    } as Partial<TransactionEntity>);

    const saved = await this.ormRepo.save(entity);

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Transaction | null> {
    const found = await this.ormRepo.findOne({ where: { id } });

    return found ? this.toDomain(found) : null;
  }

  async updateStatusById(
    id: string,
    status: string,
  ): Promise<Transaction | null> {
    // TODO: return the updated result
    await this.ormRepo.update({ id }, { transactionStatusName: status });
    const updated = await this.ormRepo.findOne({ where: { id } });

    return updated ? this.toDomain(updated) : null;
  }
}
