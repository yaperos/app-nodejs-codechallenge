
import { HttpException, HttpStatus, Injectable, UseInterceptors } from "@nestjs/common";
import { TransactionDto } from "../../domain/models/dto/transaction.dto";

import { OrmTransactionRepository } from "../../domain/repositories/orm-transaction.repository";

import { LoggingInterceptor } from "src/utils/logging.interceptor";
import { KafkaService } from "./kafka.service";


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

  constructor(private readonly transactionRepository: OrmTransactionRepository, private readonly kafkaService: KafkaService) { }

  logger = log4js.getLogger("TransactionService");

  async createTransaction(transaction: TransactionDto) {
    transaction.status = 1
    try {

      let response: TransactionDto = await this.transactionRepository.saveTransaction(transaction)
      this.kafkaService.sendMessage(JSON.stringify(response), process.env.topic ? process.env.topic : 'transaction-topic')

      return response

    } catch (ex) {
      this.logger.error(ex);

      throw new HttpException('Error Inesperado', HttpStatus.BAD_REQUEST);
    }
  }

  async getTransaction(id: number) {
    return await this.transactionRepository.findBy({ id: id });
  }

}