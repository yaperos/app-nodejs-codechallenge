import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionRequestDto,
  TransactionResponse,
} from './dto/transaction.dto';
import { TransactionDBService } from '../db-module/transaction-db/transaction.db.service';
import { Transaction } from '../../database/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatusDBService } from '../db-module/transaction-db/transaction-status.db.service';
import { TransactionTypeDBService } from '../db-module/transaction-db/transaction-type.db.service';
import { Logger } from '../../../../../modules/logger/logger.service';
import { ClientKafka } from '@nestjs/microservices';
import { VALIDATE_TRANSACTION_AMOUNT } from '../../../../../constants/kafka-topics';
import { TransactionStatusEnum } from '../../../../../constants/antifraud';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private readonly logger: Logger,
    private readonly transactionDBService: TransactionDBService,
    private readonly transctionStatusDBService: TransactionStatusDBService,
    private readonly transactionTypeDBService: TransactionTypeDBService,
  ) {}

  async createTransaction(
    transactionDto: TransactionRequestDto,
  ): Promise<TransactionResponse> {
    try {
      const transaction = await this.saveTransaction(transactionDto);
      await this.validateTransactionValue(
        transaction.transactionExternalId,
        transaction.value,
      );
      return {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
          name: transaction.transactionType.name,
        },
        transactionStatus: {
          name: transaction.transactionStatus.name,
        },
        value: transaction.value,
        createdAt: new Date(transaction.createdAt),
      };
    } catch (e) {
      this.logger.error('Error on createTransaction', e.message);
      throw new Error(e);
    }
  }

  async saveTransaction(transactionDto: TransactionRequestDto) {
    this.logger.log(`Saving transaction in DB`);
    const transactionType =
      await this.transactionTypeDBService.findTransactionTypeById(
        transactionDto.tranferTypeId,
      );
    const transactionStatus =
      await this.transctionStatusDBService.findTransactionStatusById(
        TransactionStatusEnum.PENDING,
      );
    const transaction: Transaction = {
      transactionExternalId: uuidv4(),
      accountExternalIdDebit: transactionDto.accountExternalIdDebit,
      accountExternalIdCredit: transactionDto.accountExternalIdCredit,
      transactionType: transactionType,
      value: transactionDto.value,
      transactionStatus: transactionStatus,
    };

    return await this.transactionDBService.createTransaction(transaction);
  }

  async validateTransactionValue(transactionId: string, value: number) {
    this.logger.log(`Validating transaction amount for ID: ${transactionId}`);
    this.kafkaClient.emit(
      VALIDATE_TRANSACTION_AMOUNT,
      JSON.stringify({ transactionId, value }),
    );
  }

  async updateTransaction(
    transactionId: string,
    status: TransactionStatusEnum,
  ) {
    this.logger.log(`Updating transaction status for ID: ${transactionId}`);
    const transactionStatus =
      await this.transctionStatusDBService.findTransactionStatusById(status);
    await this.transactionDBService.updateTransactionByCriteria(
      { transactionExternalId: transactionId },
      { transactionStatus },
    );
  }

  async searchTransaction(externalId: string): Promise<TransactionResponse> {
    this.logger.log(`Fetching transaction for ID: ${externalId}`);
    const transaction =
      await this.transactionDBService.findTransactionByExternalId(externalId);
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: new Date(transaction.createdAt),
    };
  }
}
