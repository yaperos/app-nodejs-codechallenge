import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { TransactionRequest } from "./model/request/transaction-request";
import { KnexDatabaseService } from "src/database/knex/knex-database.service";
import { TransactionMapper } from "./mapper/transaction-mapper";
import { ClientKafka } from "@nestjs/microservices";
import { UpdateTransactionMessage } from "./model/event/update-transaction-message";
import { GetTransactionHeader } from "./model/header/get-transaction-header";
import { TransactionReadRepository } from "./repository/transaction-read.service";

@Injectable()
export class TransactionService{

  constructor(
    private readonly dbService: KnexDatabaseService,
    @Inject('transaction-emitter') 
    private readonly clientKafka: ClientKafka,
    @Inject(TransactionReadRepository)
    private readonly transactionReadRepository: TransactionReadRepository,
    ) {}
  
  async saveTransaction(transactionRequest: TransactionRequest) {
    const transactionSaved =  await this.dbService.saveTransaction(TransactionMapper.buildTransactionToSaveFromTransactionRequest(transactionRequest));

    const messageData = JSON.stringify(TransactionMapper.buildVerifyTransactionMessageFromTransactionSaved(transactionSaved[0]));

    this.clientKafka.emit(process.env.KAFKA_TOPIC_VERIFY_TRANSACTION, messageData);

    return TransactionMapper.buildTransactionResponseFromTransactionSavedFirstCase(transactionSaved[0]);

  }

  async getTransactions(getTransactionHeaders: GetTransactionHeader) {
    let transactionList = await this.dbService.findTransactionsByProduct(getTransactionHeaders.producttype, getTransactionHeaders.productid)
    transactionList = transactionList.map(transactionItem => {
      return TransactionMapper.buildTransactionResponseFromTransactionSaved(transactionItem)
    });
    return transactionList;
  }

  async updateTransactionAndSaveInMongo(updateTransactionMessage: UpdateTransactionMessage) {
     await this.dbService.updateTransaction(updateTransactionMessage.status, updateTransactionMessage.id);
     await this.transactionReadRepository.saveTransaction(updateTransactionMessage);
     
  }
}
