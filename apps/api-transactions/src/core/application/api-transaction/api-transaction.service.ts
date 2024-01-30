import { Inject, Injectable } from '@nestjs/common';
import { CreateTransaction, Transaction } from '../../domain/model/transaction.model';
import { v4 as uuidv4 } from 'uuid'
import config from 'apps/api-transactions/src/config';
import { ConfigType } from '@nestjs/config';
import { KafkaAdapterService } from '../../../infrastructure/adapters/clients/kafka/kafka-adapter.service';

@Injectable()
export class ApiTransactionService {
  private topicTransactions: string;
  constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
    private kafkaService: KafkaAdapterService
  ) {
    this.topicTransactions = this.configService.KAFKA_TOPIC_NAME;
  }

  getHello() {
    return 'Hello from api-transaction service'
  }

  async CreateTransaction(
    requestBody: CreateTransaction
  ): Promise<Transaction> {
    const transactionID = uuidv4();
    const accountExternalIdCredit = uuidv4();
    const accountExternalIdDebit = uuidv4();
    const newTransaction: Transaction = {
      "_id": transactionID,
      "accountExternalIdCredit": accountExternalIdCredit,
      "accountExternalIdDebit": accountExternalIdDebit,
      "tranferTypeId": requestBody.tranferTypeId,
      "value": requestBody.value,
      "created_at": new Date()
    }
    await this.kafkaService.sendMessage(this.topicTransactions, newTransaction._id, newTransaction)
    return newTransaction
  }

  findAll() {
    return `This action returns all apiTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiTransaction`;
  }
  /*
    update(id: number, updateApiTransactionDto: UpdateApiTransactionDto) {
      return `This action updates a #${id} apiTransaction`;
    }
  */
  remove(id: number) {
    return `This action removes a #${id} apiTransaction`;
  }
}
