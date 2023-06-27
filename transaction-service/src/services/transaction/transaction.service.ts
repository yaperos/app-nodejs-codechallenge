import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getMetadataArgsStorage } from 'typeorm';

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../entities';
import { TransactionStatusEnum } from '../../enums/transaction-status.enum';
import { NotFoundError } from '../../helpers/errors/notfound.error';
import { CreateTransactionInput } from '../dto';
import { removeDuplicates } from './transaction.helper';
import { TransactionTablesEnum } from 'src/enums/transaction.tables.enum';
import { TransactionEvent } from '../../events/transaction.event';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject(process.env.KAFKA_PROVIDER) private clientKafka: ClientKafka,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepo: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private transactionTypeRepo: Repository<TransactionType>,
  ) {}

  private findTableFromDecorator(tableClass): string {
    const table = getMetadataArgsStorage().tables.find(
      (t) => t.target === tableClass,
    );
    return table?.name;
  }

  async getTransaction(transactionExternalId: string) {
    this.logger.log(`Retrieving ${transactionExternalId}`, 'getTransaction');

    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
    });

    this.logger.log(
      `Result from finding ${transactionExternalId}: `,
      transaction,
    );

    if (transaction === null) return new NotFoundError('Transaction not found');

    return transaction;
  }

  async getTransactions() {
    this.logger.log(`Retrieving all transactions...`);
    return this.transactionRepository.find();
  }

  async getTransacStatusFromTids(transactionStatusIds: number[]) {
    this.logger.log(
      `Retrieving status values from Transaction Ids using query builder`,
      `getTransacStatusFromTids`,
    );
    return this.queryBuilderForTransactionData(
      transactionStatusIds,
      'transactionStatus',
      this.findTableFromDecorator(TransactionStatus),
    );
  }

  async getTransacTypesFromTids(ids: number[]) {
    this.logger.log(
      `Retrieving transaction types from transactions ids using query builder`,
      `getTransacTypesFromTids`,
    );
    return this.queryBuilderForTransactionData(
      ids,
      'transactionType',
      this.findTableFromDecorator(TransactionType),
    );
  }

  async getTransactionTypeFromBatch(transactionTypeIds: number[]) {
    const transactionTypeList = await this.getTransacTypesFromTids(
      transactionTypeIds,
    );

    return transactionTypeIds.map((transactionTypeId) => {
      return transactionTypeList.find(
        (transactionType) => transactionType.id === transactionTypeId,
      );
    });
  }

  private buildTransactionObject(data: CreateTransactionInput) {
    return this.transactionRepository.create({
      value: data.value,
      transactionTypeId: data.tranferTypeId,
      accountExternalIdCredit: data.accountExternalIdCredit,
      accountExternalIdDebit: data.accountExternalIdDebit,
      transactionStatusId: TransactionStatusEnum.PENDING,
    });
  }

  private async saveTransaction(newTransaction: Transaction) {
    this.clientKafka.emit(
      TransactionEvent.getName(),
      TransactionEvent.toEvent(newTransaction),
    );
    return this.transactionRepository.save(newTransaction);
  }

  async createTransaction(data: CreateTransactionInput) {
    const newTransaction = this.buildTransactionObject(data);
    return this.saveTransaction(newTransaction);
  }

  async getTransactionStatusFromBatch(ids: number[]) {
    const transactionStatusList = await this.getTransacStatusFromTids(ids);

    return ids.map((statusId) => {
      return transactionStatusList.find((status) => status.id === statusId);
    });
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    status: TransactionStatusEnum,
  ) {
    this.logger.log(
      `Updating transaction ${transactionExternalId} status to ${status}`,
    );
    return this.transactionRepository.update(
      { transactionExternalId },
      {
        transactionStatusId: status,
      },
    );
  }

  private getRepoOnName(name: string) {
    switch (name) {
      case TransactionTablesEnum.TRANSACTION_STATUS:
        return this.transactionStatusRepo;
      case TransactionTablesEnum.TRANSACTION_TYPE:
        return this.transactionTypeRepo;
    }
    throw new NotFoundError(`Not found table name ${name}`);
  }

  private async queryBuilderForTransactionData(
    ids: number[],
    builder: string,
    tableName: string,
  ) {
    const uniqueIds = removeDuplicates(ids);
    const conditionStatement = `${builder}.id in (${uniqueIds.join(', ')})`;
    this.logger.log(`TABLE NAME ${tableName}`);
    this.logger.log(`conditionStatement ${conditionStatement}`);
    const repo = this.getRepoOnName(tableName);
    return repo.createQueryBuilder(builder).where(conditionStatement).getMany();
  }
}
