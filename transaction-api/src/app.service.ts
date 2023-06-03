import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTransactionInput,
  TransactionDBEventPayload,
  UpdateTransactionStatusEventPayload,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import * as crypto from 'crypto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('TRANSACTION_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  createTransaction(transactionPayload: CreateTransactionInput) {
    const transactionExternalId = crypto.randomUUID();
    const transcriptionData = {
      ...transactionPayload,
      transactionExternalId,
      status: 'pending',
    };

    const transactionMessage: {
      key: string;
      value: TransactionDBEventPayload;
    } = {
      // key is important to keep create/update messages in the same partition and maintain messages order
      key: transactionExternalId,
      value: {
        data: transcriptionData,
        operation: 'create',
      },
    };
    this.kafkaClient.emit('transactionDB', transactionMessage);

    this.kafkaClient.emit('antifraudVerification', {
      value: transcriptionData,
    });
    return transcriptionData;
  }

  updateTransactionStatusConsumer(
    transactionPayload: UpdateTransactionStatusEventPayload,
  ) {
    const { transactionExternalId, data } = transactionPayload;

    const transactionMessage: {
      key: string;
      value: TransactionDBEventPayload;
    } = {
      // key is important to keep create/update messages in the same partition and maintain messages order
      key: transactionExternalId,
      value: {
        where: { transactionExternalId },
        data,
        operation: 'update',
      },
    };
    this.kafkaClient.emit('transactionDB', transactionMessage);
  }

  async findTransactionByExternalId(transactionExternalId: string) {
    const transaction = await this.transactionService.transaction({
      transactionExternalId,
    });
    if (!transaction) {
      // it could return not found if the query is made before the transaction creation message is consumed
      throw new NotFoundException(transactionExternalId);
    }
    return {
      transactionExternalId,
      transactionType: {
        name: transaction.transferTypeId,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  async transactionDBConsumer(transactionPayload: TransactionDBEventPayload) {
    switch (transactionPayload.operation) {
      case 'create': {
        await this.transactionService.createTransaction(
          transactionPayload.data,
        );
        break;
      }
      case 'update': {
        await this.transactionService.updateTransaction(
          transactionPayload.where,
          transactionPayload.data,
        );
        break;
      }
      default: {
        break;
      }
    }
  }
}
