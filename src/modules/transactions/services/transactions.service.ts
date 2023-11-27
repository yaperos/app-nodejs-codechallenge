import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { EachMessagePayload, ProducerRecord } from 'kafkajs';
import { ApiError } from 'src/common/api-errors/api-error';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ETransactionStatus } from 'src/domain/enums/transaction-status.enum';
import { DataAccessService } from 'src/infra/cache/data-access.service';
import { KafkaService } from 'src/infra/kafka/services/kafka.service';
import { TransactionStatusService } from 'src/modules/transaction-status/services/transaction-status.service';
import { TransactionTypeService } from 'src/modules/transaction-type/services/transaction-type.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AntiFraudTransactionResultDto } from '../dto/anti-fraud-transaction-result.dto';
import { CreateTransactionRequestDTO } from '../dto/create-transaction-request.dto';

export const transactionAmountRestriction = 1000;

@Injectable()
export class TransactionsService extends DataAccessService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private transactionTypeService: TransactionTypeService,
    private transactionStatusService: TransactionStatusService,
    private kafkaService: KafkaService,
    @Inject(CACHE_MANAGER)
    protected cacheManager: Cache,
    protected configService: ConfigService,
  ) {
    super(
      cacheManager,
      configService,
      'transaction',
      TransactionsService.name,
      60000,
    );
  }

  async getById(id: string): Promise<Transaction | null> {
    const itemCacheKey = this.cacheKey(id);

    const dbQuery = async function () {
      return await this.transactionRepository.findOne({
        where: { id },
        relations: { status: true, type: true },
      });
    };

    return await this.findOrFetchFromDatabase<Transaction>(
      itemCacheKey,
      dbQuery.bind(this),
    );
  }

  private async sendTransactionCreatedEvent(transactionId: string) {
    try {
      const transactionCreatedRecord: ProducerRecord = {
        topic: this.configService.get('KAFKA_TRANSACTION_CREATED_TOPIC'),
        messages: [
          {
            value: JSON.stringify({ transactionId: transactionId }),
          },
        ],
      };
      await this.kafkaService.produce(transactionCreatedRecord);
    } catch (error) {
      this.logger.error(
        `something went wrong while trying to send the event transaction-created, err: ${error.message}`,
      );
      throw error;
    }
  }

  private async validateAndRetrieveCreateTransactionDetails(
    transactionTypeId: number,
    transactionStatusName: ETransactionStatus,
  ) {
    const [transactionType, transactionStatus] = await Promise.all([
      this.transactionTypeService.getById(transactionTypeId),
      this.transactionStatusService.getByName(transactionStatusName),
    ]);

    if (!transactionType)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        `invalid transaction type (${transactionTypeId})`,
      );
    if (!transactionStatus)
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `transaction type with name "${transactionStatusName}" not found`,
      );

    return {
      transactionType,
      transactionStatus,
    };
  }

  async create({
    accountExternalIdCredit,
    accountExternalIdDebit,
    transferTypeId,
    value,
  }: CreateTransactionRequestDTO): Promise<Transaction> {
    if (value > transactionAmountRestriction)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        `transaction amount is greater then the limit allowed (${transactionAmountRestriction})`,
      );

    const { transactionStatus, transactionType } =
      await this.validateAndRetrieveCreateTransactionDetails(
        transferTypeId,
        ETransactionStatus.PENDING,
      );

    const now = dayjs();
    const transaction = this.transactionRepository.create({
      id: uuidv4(),
      accountCreditId: accountExternalIdCredit,
      accountDebitId: accountExternalIdDebit,
      amount: value,
      status: transactionStatus,
      type: transactionType,
      createdAt: now,
      updatedAt: now,
    });
    await this.transactionRepository.save(transaction);
    this.logger.log(`new transaction created with id ${transaction.id}`);

    await this.sendTransactionCreatedEvent(transaction.id);

    return transaction;
  }

  async subscribeAntiFraudTransactionEvaluation() {
    await this.kafkaService.consume(
      {
        topics: [this.configService.get('KAFKA_ANTI_FRAUD_EVALUATION_TOPIC')],
      },
      { eachMessage: this.handleAntiFraudEvaluation.bind(this) },
    );
  }

  private async handleAntiFraudEvaluation(payload: EachMessagePayload) {
    try {
      const evaluationResult = JSON.parse(payload.message.value.toString());
      const { result, transactionId } = plainToInstance(
        AntiFraudTransactionResultDto,
        evaluationResult,
      );

      const [transaction, newStatus] = await Promise.all([
        this.getById(transactionId),
        this.transactionStatusService.getByName(result),
      ]);
      if (!transaction)
        throw new Error(`transaction with id (${transactionId}) was not found`);

      if (!newStatus)
        throw new Error(
          `transaction status with name (${result}) was not found`,
        );

      const prevStatusName = transaction.status.name;
      transaction.status = newStatus;

      await this.transactionRepository.save(transaction);

      const itemCacheKey = this.cacheKey(transaction.id);
      await this.setCacheItem(itemCacheKey, transaction);

      this.logger.log(
        `transaction (with id: ${transaction.id}) status was updated from "${prevStatusName}" to "${newStatus.name}"`,
      );
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
