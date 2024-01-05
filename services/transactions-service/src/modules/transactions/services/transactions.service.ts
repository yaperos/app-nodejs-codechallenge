import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { DataSource } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedMessage } from '../messages/transaction-created.message';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    private dataSource: DataSource,
    @Inject('TRANSACTIONS_PRODUCER')
    private readonly transactionsProducer: ClientKafka,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      this.logger.debug(`Transaction creation started`);

      const createdTransaction = await queryRunner.manager.save(
        TransactionEntity,
        createTransactionDto,
      );

      const {
        id,
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        value,
      } = createdTransaction;

      await queryRunner.startTransaction();

      this.transactionsProducer.emit(
        'transaction_created',
        new TransactionCreatedMessage(
          id,
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
        `Error trying to create transaction. Error message: ${error.message}.`,
      );
    } finally {
      await queryRunner.release();
    }
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

      await queryRunner.commitTransaction();

      this.logger.debug(
        `Transaction successfully updated: id [${id}], status [${status}]`,
      );

      return updatedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Error trying to update transaction: id [${id}], status [${status}]. Error message: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
