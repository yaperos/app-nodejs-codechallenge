
import { Injectable, UseInterceptors } from "@nestjs/common";
import { TransactionDto } from "../../domain/models/dto/transaction.dto";
import axios from "axios";

import { OrmTransactionRepository } from "../../domain/repositories/orm-transaction.repository";

import { LoggingInterceptor } from "src/utils/logging.interceptor";
import { RetrieveTransactionDto } from "src/domain/models/dto/retrieveTransaction.dto";

const log4js = require("log4js");

const logType = process.env.LOG_TYPE ? process.env.LOG_TYPE : 'file';
const logFilename = process.env.LOG_FILENAME ? process.env.LOG_FILENAME : 'logs/app.log';
const lognumBackups = process.env.LOG_numBackups ? process.env.LOG_numBackups : '';
const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

log4js.configure({
  appenders: {
    ms_appenders: {
      type: logType,
      filename: logFilename,
      numBackups: lognumBackups
    }
  },
  categories: {
    default: { appenders: ['ms_appenders'], level: logLevel }
  }
});


@Injectable()
@UseInterceptors(LoggingInterceptor)
export class TransactionService {

  constructor(private readonly transactionRepository: OrmTransactionRepository) { }

  logger = log4js.getLogger("TransactionService");


  async updateTransaction(transaction: TransactionDto) {

    let response: TransactionDto = await this.transactionRepository.saveTransaction(transaction)
    return response
  }


  async processTransaction(transaction: TransactionDto) {
    let response: RetrieveTransactionDto = await this.sendAttempt(transaction)

    if (response["status"] < 300) {

      let dataResponse = response["data"]

      this.logger.log("processTransaction.dataResponse:", dataResponse)

      transaction.status = dataResponse.transactionStatus["name"]
      let createdAtDB = dataResponse["createdAt"].replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3");
      transaction.createdAt = createdAtDB
      this.logger.log("processTransaction.transaction.update:", transaction)
      this.updateTransaction(transaction)


    } else {
      this.logger.log("Error:", response["status"])
    }

  }

  async sendAttempt(message: TransactionDto): Promise<RetrieveTransactionDto> {

    const endpoint = `${process.env.antifraud_path}`
    return await axios
      .post(endpoint, message)
      .then(response => {
        return response
      })
      .catch(async (error) => {

        return error
      })
  }


}