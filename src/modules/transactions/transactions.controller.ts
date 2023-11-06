import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
  ParseUUIDPipe,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';

import { CreateTransactionDto, TransactionDto } from './transactions.dto';
import { LoggerService } from '@shared/logger/logger.service';
import { SERVICE_ERROR } from '@config/errors.enum';
import { TransactionsService } from './transactions.service';
import { API_NAME } from '@config/app';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
} from '@nestjs/microservices';
import { KAFKA_TOPICS, TOPIC_NAMES } from '@config/kafka.config';

@Controller('transactions')
export class TransactionsController
  extends LoggerService
  implements OnModuleInit, OnModuleDestroy
{
  @Inject() private readonly transactionsService: TransactionsService;
  @Inject(API_NAME) private readonly client: ClientKafka;
  constructor() {
    super(TransactionsController.name);
  }

  async onModuleInit(): Promise<void> {
    KAFKA_TOPICS.forEach((topic) => this.client.subscribeToResponseOf(topic));
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  @MessagePattern(TOPIC_NAMES.FRAUD_STATUS_TRANSACTION_TOPIC)
  async readFraudStatusTransactionTopicAndUpdateOnDatabase(
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    try {
      await this.transactionsService.readFraudStatusTransactionTopicAndUpdateOnDatabase(
        TOPIC_NAMES.FRAUD_STATUS_TRANSACTION_TOPIC,
        context,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  @MessagePattern(TOPIC_NAMES.FRAUD_TRANSACTION_VALIDATION_TOPIC)
  async readFraudTransactionValidationTopic(
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const originalMessage = context.getMessage();

    this.logger.log(
      `✅ Message to Fraud Successfully Received on Topic ${
        TOPIC_NAMES.FRAUD_TRANSACTION_VALIDATION_TOPIC
      }: ${JSON.stringify(originalMessage.value)}`,
    );
  }

  @Post('/')
  async createTransaction(
    @Headers('trace_id') traceId: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() response,
  ): Promise<TransactionDto> {
    try {
      const transaction: TransactionDto =
        await this.transactionsService.createTransaction(createTransactionDto);

      return response.status(200).json(transaction);
    } catch (error) {
      const errorArray = [];
      errorArray.push({
        origin: `${
          SERVICE_ERROR.TRANSACTIONS_CHALLENGE
        }_${TransactionsController.name.toUpperCase()}_CREATE_TRANSACTION`,
        trace_id: traceId,
        message: error.message,
      });
      this.logger.error(errorArray);

      return response.status(500).json(errorArray);
    }
  }

  @Get('/:transactionExternalId')
  async getTransactionByExternalId(
    @Headers('trace_id') traceId: string,
    @Param('transactionExternalId', new ParseUUIDPipe())
    transactionExternalId: string,
    @Res() response,
  ): Promise<TransactionDto> {
    try {
      const transaction: TransactionDto =
        await this.transactionsService.getTransactionByExternalId(
          transactionExternalId,
        );

      return response.status(200).json(transaction);
    } catch (error) {
      const errorArray = [];
      errorArray.push({
        origin: `${
          SERVICE_ERROR.TRANSACTIONS_CHALLENGE
        }_${TransactionsController.name.toUpperCase()}_GET_TRANSACTION_BY_EXTERNAL_ID`,
        trace_id: traceId,
        message: error.message,
      });
      this.logger.error(errorArray);

      return response.status(500).json(errorArray);
    }
  }
}
