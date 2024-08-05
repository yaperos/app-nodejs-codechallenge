import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionModel } from '../database/models/transaction.model';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/itransaction.repository';
import { TransactionStatus } from '../../domain/entities/status.entity';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactionRepository: Repository<TransactionModel>,
  ) {}

  async create(transactionRegister: Transaction): Promise<Transaction> {
    const transactionModel = this.transactionRepository.create({
      transactionExternalId: transactionRegister.getTransactionExternalId(),
      accountExternalIdDebit: transactionRegister.getAccountExternalIdDebit(),
      accountExternalIdCredit: transactionRegister.getAccountExternalIdCredit(),
      value: transactionRegister.getValue(),
      transactionStatusId: transactionRegister.getTransactionStatus().getId(),
      transactionTypeId: transactionRegister.getTransactionType().getId(),
    });
    const savedEntity = await this.transactionRepository.save(transactionModel);
    return this.mapEntityToDomain(savedEntity);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const transactionModel = this.mapDomainToEntity(transaction);
    const savedEntity = await this.transactionRepository.save(transactionModel);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Transaction> {
    const transactionEntity = await this.transactionRepository.findOneBy({
      id: id,
    });
    return this.mapEntityToDomain(transactionEntity);
  }

  private mapDomainToEntity(transaction: Transaction): TransactionModel {
    const transactionEntity = new TransactionModel();
    transactionEntity.id = transaction.getId();
    transactionEntity.transactionExternalId =
      transaction.getTransactionExternalId();
    transactionEntity.accountExternalIdDebit =
      transaction.getAccountExternalIdDebit();
    transactionEntity.accountExternalIdCredit =
      transaction.getAccountExternalIdCredit();
    transactionEntity.value = transaction.getValue();
    transactionEntity.transactionStatusId = transaction
      .getTransactionStatus()
      .getId();
    transactionEntity.transactionTypeId = transaction
      .getTransactionType()
      .getId();
    return transactionEntity;
  }

  private mapEntityToDomain(transactionEntity: TransactionModel): Transaction {
    return Transaction.reconstitute(
      transactionEntity.transactionExternalId,
      transactionEntity.accountExternalIdDebit,
      transactionEntity.accountExternalIdCredit,
      transactionEntity.value,
      new TransactionStatus(transactionEntity.transactionStatusId, ''),
      new TransactionType(transactionEntity.transactionTypeId, ''),
      transactionEntity.id,
      transactionEntity.createdAt,
      transactionEntity.updatedAt,
    );
  }
}
