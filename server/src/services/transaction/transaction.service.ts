import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';
import { InjectRepository } from '@nestjs/typeorm';
import { first } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../entities';
import { TransactionStatusEnum } from '../../enums/transaction-status.enum';
import { NotFoundError } from '../../helpers/errors/notfound.error';
import { CreateTransactionInput } from '../dto';
import { removeDuplicates } from './transaction.helper';
import { AntifraudValidationPayload } from 'src/interfaces/antifraud-validation-payload.interface';
import { getMetadataArgsStorage } from 'typeorm';
import { TransactionTablesEnum } from 'src/enums/transaction.tables.enum';
@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject(process.env.KAFKA_PROVIDER) private clientKafka: ClientKafka,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepo: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private transactionTypeRepo: Repository<TransactionType>,
    @InjectMetric('transactions_saved')
    public transactions_saved_counter: Counter<string>,
    @InjectMetric('transactions_updated')
    public transactions_updated_counter: Counter<string>,
  ) {}

  private findTableFromDecorator(tableClass): string {
    const table = getMetadataArgsStorage().tables.find(
      (t) => t.target === tableClass,
    );
    return table?.name;
  }

  async onModuleInit() {
    this.logger.log(`Subscribe to yape service`);
    this.clientKafka.subscribeToResponseOf('yape.new.transaction');
    await this.clientKafka.connect();
  }

  async OnModuleDestroy() {
    this.logger.log(`Unsubscribe from yape service`);
    await this.clientKafka.close();
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

  handleValidation = (response: {
    transactionExternalId: string;
    valid: boolean;
  }) => {
    this.logger.log(
      `Handle response from antifraud service result: `,
      response,
      `handleValidation`,
    );
    this.updateTransactionStatus(
      response.transactionExternalId,
      response.valid
        ? TransactionStatusEnum.APPROVED
        : TransactionStatusEnum.REJECTED,
    );
    this.transactions_updated_counter.inc(1);
  };

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

    const mappedResults = transactionTypeIds.map((transactionTypeId) => {
      return transactionTypeList.find(
        (transactionType) => transactionType.id === transactionTypeId,
      );
    });

    return mappedResults;
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

  private buildDataToSendToAntifraudService(
    transaction: Transaction,
  ): AntifraudValidationPayload {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionValue: transaction.value,
    };
  }

  private async saveTransaction(newTransaction: Transaction) {
    return this.transactionRepository.save(newTransaction);
  }

  private subscribeToAntifraudValidation(
    dataToSend: AntifraudValidationPayload,
  ) {
    this.logger.log(
      `Subscribing to antifraud validation service response`,
      `subscribeToAntifraudValidation`,
    );
    this.clientKafka
      .send('yape.new.transaction', dataToSend)
      .pipe(first())
      .subscribe({
        next: this.handleValidation,
        error: (err) => {
          this.logger.error(err, 'Error while validating with kafka');
        },
      });
  }

  async createTransaction(data: CreateTransactionInput) {
    const newTransaction = this.buildTransactionObject(data);

    const savedTransaction = await this.saveTransaction(newTransaction);

    this.logger.log('transactions_saved_counter');
    this.transactions_saved_counter.inc(1);

    const dataToSend = this.buildDataToSendToAntifraudService(savedTransaction);

    this.subscribeToAntifraudValidation(dataToSend);

    return savedTransaction;
  }

  async getTransactionStatusFromBatch(ids: number[]) {
    const transactionStatusList = await this.getTransacStatusFromTids(ids);

    const statusList = ids.map((statusId) => {
      return transactionStatusList.find((status) => status.id === statusId);
    });

    return statusList;
  }

  async updateTransactionStatus(
    transactionExternalId: string,
    status: TransactionStatusEnum,
  ) {
    this.logger.log(
      `Updating transaction ${transactionExternalId} status to ${status}`,
    );
    const updateResult = await this.transactionRepository.update(
      { transactionExternalId },
      {
        transactionStatusId: status,
      },
    );

    return updateResult;
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
    const dataRequested = repo
      .createQueryBuilder(builder)
      .where(conditionStatement)
      .getMany();
    return dataRequested;
  }
}
