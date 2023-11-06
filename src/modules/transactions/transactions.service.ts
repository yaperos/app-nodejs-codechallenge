import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '@shared/logger/logger.service';
import {
  CreateTransactionDto,
  FraudValidationDto,
  TransactionDto,
  TransactionEntityDto,
} from './transactions.dto';
import { TransactionsEntity } from '@entities/transactions.entity';
import {
  mapTransactionToEntity,
  mapTransactionToResponse,
} from './mappers/transactions.mapper';
import { KafkaService } from '../../shared/kafka/kafka.service';
import { TOPIC_NAMES } from '@config/kafka.config';
import { TRANSACTION_STATUS } from '@config/transaction-status.enum';

@Injectable()
export class TransactionsService extends LoggerService {
  @Inject()
  private readonly kafkaService: KafkaService;
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
  ) {
    super(TransactionsService.name);
  }

  async createTransaction(
    dataForCreateTransaction: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const transactionTransformedToEntity: TransactionEntityDto =
      mapTransactionToEntity(dataForCreateTransaction);
    const transactionSaved: TransactionsEntity =
      await this.transactionsRepository.save(transactionTransformedToEntity);

    if (transactionSaved.transaction_status === TRANSACTION_STATUS.PENDING) {
      this.kafkaService.sendTransactionToFraudValidationTopic(
        TOPIC_NAMES.FRAUD_TRANSACTION_VALIDATION_TOPIC,
        dataForCreateTransaction,
      );
    }

    return mapTransactionToResponse(transactionSaved);
  }

  async getTransactionByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionDto> {
    const transactionOnDatabase: TransactionsEntity =
      await this.findOneByTransactionExternalId(transactionExternalId);

    return mapTransactionToResponse(transactionOnDatabase);
  }

  private async findOneByTransactionExternalId(
    transactionExternalId: string,
  ): Promise<TransactionsEntity> {
    return this.transactionsRepository.findOneOrFail({
      transaction_external_id: transactionExternalId,
    });
  }

  async readFraudStatusTransactionTopicAndUpdateOnDatabase(
    topicName,
    context,
  ): Promise<void> {
    const originalMessage = await context.getMessage();
    this.logger.log(
      `<-- Receiving new message from topic: ${topicName}: ` +
        JSON.stringify(originalMessage.value),
    );
    const fraudValidation: FraudValidationDto = JSON.parse(
      JSON.stringify(originalMessage.value),
    );
    const transaction: TransactionsEntity =
      await this.findOneByTransactionExternalId(
        fraudValidation?.transactionExternalId,
      );

    if (transaction) {
      const changes = {
        transaction_status: fraudValidation?.transactionStatus,
      };
      await this.transactionsRepository.update(transaction.id, changes);
    }
  }
}
