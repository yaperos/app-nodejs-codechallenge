
import { Injectable, UseInterceptors } from "@nestjs/common";
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { LoggingInterceptor } from "src/utils/logging.interceptor";

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
export class KafkaService {

  logger = log4js.getLogger("TransactionService");

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.clientID ? process.env.clientID :  'yape-kafka',
        brokers: [process.env.kafkaServer ? process.env.kafkaServer :  'localhost:9092'],
      },
      consumer: {
        groupId: process.env.groupId ? process.env.groupId :  'yape-kafka'
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {

    this.client.subscribeToResponseOf(process.env.topic ? process.env.topic : 'transaction-topic');
    await this.client.connect();
  }

  async sendMessage(message: string, topic: string) {
    this.logger.log("sendMessage:", message, topic)
    return this.client.send(topic, message).forEach(e => console.log("Sended!!!")).catch(er => this.logger.log(er))
  }

}

