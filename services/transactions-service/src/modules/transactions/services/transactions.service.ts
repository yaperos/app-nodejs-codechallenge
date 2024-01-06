import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { DataSource } from 'typeorm';
import {
  ClientKafka,
  KafkaRetriableException,
  RpcException,
} from '@nestjs/microservices';
import { TransactionCreatedMessage } from '../messages/transaction-created.message';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionStatusUpdatedMessage } from '../messages/transaction-status-updated.message';
import { TransactionsTypesService } from 'src/modules/transactions-types/services/transactions-types.service';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    private dataSource: DataSource,
    private readonly transactionsTypesService: TransactionsTypesService,
    @Inject('TRANSACTIONS_PRODUCER')
    private readonly transactionsProducer: ClientKafka,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const { transactionExternalId, tranferTypeId } = createTransactionDto;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.logger.debug(
        `Transaction creation started with external id [${transactionExternalId}]`,
      );

      const transactionType = await this.getTransactionType(tranferTypeId);

      const createdTransaction = await queryRunner.manager.save(
        TransactionEntity,
        { transactionType, ...createTransactionDto },
      );

      const { id, accountExternalIdDebit, accountExternalIdCredit, value } =
        createdTransaction;

      this.transactionsProducer.emit(
        'transaction.created',
        new TransactionCreatedMessage(
          id,
          transactionExternalId,
          accountExternalIdDebit,
          accountExternalIdCredit,
          tranferTypeId,
          value,
        ),
      );

      await queryRunner.commitTransaction();

      this.logger.debug(`Transaction successfully created with id [${id}]`);

      return createdTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Error trying to create transaction with transactionExternalId [${transactionExternalId}]. Error message: ${error.message}.`,
      );

      if (error instanceof RpcException) {
        // TODO: provide some error handler method
        return;
      }

      throw new KafkaRetriableException(
        `Error trying to create transaction with transactionExternalId [${transactionExternalId}]. Error message: ${error.message}.`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private async getTransactionType(tranferTypeId: number) {
    const transactionType =
      await this.transactionsTypesService.findOne(tranferTypeId);

    if (!transactionType) {
      throw new RpcException(
        `Transaction type with id [${tranferTypeId}] is not valid`,
      );
    }

    return transactionType;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { status } = updateTransactionDto;

    this.logger.debug(
      `Transaction update started: id [${id}], status [${status}]`,
    );

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatedTransaction = await queryRunner.manager.save(
        TransactionEntity,
        { id, status },
      );

      const transaction = await queryRunner.manager.findOne(TransactionEntity, {
        where: { id },
        relations: {
          transactionType: true,
        },
      });

      await queryRunner.commitTransaction();

      this.logger.debug(
        `Transaction successfully updated: id [${id}], status [${status}]`,
      );

      this.transactionsProducer.emit(
        'transaction.status.udpated',
        new TransactionStatusUpdatedMessage(transaction),
      );

      return updatedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Error trying to update transaction: id [${id}], status [${status}]. Error message: ${error.message}`,
      );

      throw new RpcException(
        `Error trying to update transaction: id [${id}], status [${status}]. Error message: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
