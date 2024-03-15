import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ITransactionService } from '../ITransactionService';
import { ITransactionRepository } from '../../../domain/repositories/database/ITransactionRepository';
import { TransactionDTO } from '../../dto/TransactionDTO';
import { ITransactionCatalogService } from '../ITransactionCatalogService';
import { CatalogTypes } from '../../../domain/enums/CatalogTypes';
import { TransactionModel } from '../../../domain/model/Transaction.model';
import { TransactionCatalogModel } from '../../../domain/model/TransactionCatalog.model';
import { IKafkaProducer } from '../../../domain/stream/producer/IKafkaProducer';
import { TransactionEvaluatedDTO } from '../../dto/TransactionEvaluatedDTO';
import { ICacheRepository } from '../../../domain/repositories/cache/ICacheRepository';
import { TransactionDetailModel } from '../../../domain/model/TransactionDetail.model';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    private readonly cache: ICacheRepository,
    private readonly producer: IKafkaProducer,
    private readonly repository: ITransactionRepository,
    private readonly catalogService: ITransactionCatalogService,
  ) {}

  async createTransaction(transaction: TransactionDTO): Promise<void> {
    const transactionType: TransactionCatalogModel =
      await this.catalogService.findById(transaction.transferTypeId);

    if (
      !Object.keys(transactionType).length ||
      transactionType.type !== CatalogTypes.TRANSACTION_TYPE
    ) {
      Logger.error(
        `The transaction could not be executed because the id: ${transaction.transferTypeId} is incorrect`,
      );
      throw new HttpException(
        'The transaction could not be executed due to an error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const transactionStatus: TransactionCatalogModel =
      await this.catalogService.findByNameAndType(
        'PENDING',
        CatalogTypes.TRANSACTION_STATUS,
      );

    if (!Object.keys(transactionStatus).length) {
      Logger.error(
        `The transaction could not be executed because the status PENDING does not exists`,
      );
      throw new HttpException(
        'The transaction could not be executed due to an error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newTransaction: TransactionModel = {
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      value: transaction.value,
      transactionStatusId: transactionStatus.id,
      transactionTypeId: transactionType.id,
    };

    await this.repository.createTransaction(newTransaction);
    await this.producer.sendMessage(newTransaction);
  }

  async updateTransactionAfterEvaluate(
    data: TransactionEvaluatedDTO,
  ): Promise<void> {
    const transactionStatus: TransactionCatalogModel =
      await this.catalogService.findByNameAndType(
        data.status,
        CatalogTypes.TRANSACTION_STATUS,
      );

    await this.repository.updateTransactionStatus(
      data.transactionExternalId,
      transactionStatus.id,
    );
  }

  async findTransactionById(id: string): Promise<TransactionDetailModel> {
    return this.repository.findTransactionById(id);
  }
}
