import { Injectable } from '@nestjs/common';
import {
  DataTransactionCreateDTO,
  DataUpdateTransactionDTO,
} from './transactions.dto';
import { TransactionsService } from './transactions.service';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaPayload } from 'src/kafka/kafka.message';
import { randomUUID } from 'crypto';
import { TransactionsEntity } from '@app/common/database/models';
import { CLIENT_KAFKA, MESSAGE, TOPICS } from './transactions.constants';
import { DataEvent } from './transactions.interface';
import { StatusTransaction } from '@app/common/utils/enum/status.enum';
import { TransactionRespository } from '@app/common/database/models/repositories';
import { TransactionDAO } from '@app/common/database/models/dao';

@Injectable()
export class TransactionsUseCase {
  private readonly transactionRepository: TransactionRespository;
  private readonly transactionDAO: TransactionDAO;

  constructor(public transactionService?: TransactionsService) {
    this.transactionRepository = transactionService.transactionRepository;
    this.transactionDAO = transactionService.transactionDAO;
  }

  async listTransaction(): Promise<TransactionsEntity[]> {
    const response = await this.transactionService.listTransaction();
    return response;
  }

  async createTransaction(
    data: DataTransactionCreateDTO,
  ): Promise<TransactionsEntity> {
    data.accountExternalIdCredit = randomUUID();
    data.accountExternalIdDebit = randomUUID();
    const response = await this.transactionService.createTransaction(data);

    const client = new ClientKafka({
      client: {
        clientId: CLIENT_KAFKA.ID_TRANSACTION,
        brokers: [process.env.KAFKA_URL],
      },
    });
    const event = new KafkaPayload();
    event.body = response;
    event.messageId = randomUUID();
    event.topicName = TOPICS.CREATED_TRANSACTION;
    event.messageType = MESSAGE.CREATED_TRANSACTION;
    client.emit(event.topicName, JSON.stringify(event));
    return response;
  }

  async updateTransaction(payload: string): Promise<any> {
    const _event: DataEvent = JSON.parse(payload);
    const { data_transaction, status } = _event.body;
    const data_update = new DataUpdateTransactionDTO();
    data_update.status = status
      ? StatusTransaction.APPROVED
      : StatusTransaction.REJECTED;
    data_update.transactionExternalId = data_transaction.transactionExternalId;
    data_update.value = data_transaction.value;
    const response = await this.transactionService.updateTransaction(
      data_transaction.transaction_id,
      data_update,
    );
    return response;
  }

  // Método que utiliza TransactionsService sin inyectarlo en el constructor
  async someOtherMethod(payload: string): Promise<any> {
    const _event: DataEvent = JSON.parse(payload);
    const { data_transaction, status } = _event.body;
    const data_update = new DataUpdateTransactionDTO();
    data_update.status = status
      ? StatusTransaction.APPROVED
      : StatusTransaction.REJECTED;
    data_update.transactionExternalId = data_transaction.transactionExternalId;
    data_update.value = data_transaction.value;
    const result = await this.transactionRepository.update(
      data_transaction.transaction_id,
      data_update,
    );

    return result;
  }
}
