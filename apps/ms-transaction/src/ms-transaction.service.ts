import { Inject, Injectable } from '@nestjs/common';
import { TransactionDbService } from './db/transaction/transaction.service';
import { StatusResponse, TransactionRequest } from './dto/transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import {
  TransactionQueue,
  TransactionStatus,
} from './Interfaces/transaction,interface';
import {
  TransactionQueueSchema,
  statusSchema,
} from './constants/transaction.schema';
import { ANTI_FRAUD_GET_TOPIC } from './constants/topics';

const objectMapper = require('object-mapper');

@Injectable()
export class MsTransactionService {
  constructor(
    private readonly transactionDbService: TransactionDbService,
    @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka,
  ) {}
  async createTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<string> {
    const { requestId } = transactionRequest;
    await this.transactionDbService.createTransaction(transactionRequest);
    const payload: TransactionQueue = objectMapper(
      transactionRequest,
      TransactionQueueSchema,
    );
    this.clientKafka.emit(ANTI_FRAUD_GET_TOPIC, JSON.stringify(payload));
    return requestId;
  }

  async updateTransaction({
    requestId,
    status,
  }: TransactionStatus): Promise<void> {
    await this.transactionDbService.updateTransactionStatus(requestId, {
      status,
    });
  }

  async getStatusTransaction(requestId: string): Promise<StatusResponse> {
    const transaction =
      await this.transactionDbService.getTransactionStatus(requestId);
    if (!transaction) {
      return null;
    }
    return objectMapper(transaction, statusSchema);
  }
}
