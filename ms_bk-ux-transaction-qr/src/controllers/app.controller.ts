import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { TOPICS, TRANSACTION_EVENTS } from 'src/config/contants/topics';
import { TransactionCreatedRequestDto } from 'src/dtos/transaction-created-request.dto';
import { TransactionDetailRequestDto } from 'src/dtos/transaction-detail-request.dto';
import { GetTransactionQuery } from 'src/queries/impl/get-transaction.query';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly appService: AppService,
  ) {}

  @MessagePattern(TOPICS.TRANSACTION_DETAIL)
  async getTransaction(@Payload() data: TransactionDetailRequestDto) {
    try {
      const response = await this.queryBus.execute(
        new GetTransactionQuery(data.externalId),
      );

      return response;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.error.message ?? 'An unexpected error occurred',
      });
    }
  }

  @EventPattern(TRANSACTION_EVENTS.CREATED)
  async handleCreated(@Payload('data') data: TransactionCreatedRequestDto) {
    this.logger.log('Transaction created', data);
    await this.appService.createTransaction(data);
  }

  @EventPattern(TRANSACTION_EVENTS.UPDATED)
  async handleUpdated(@Payload('data') data: TransactionCreatedRequestDto) {
    this.logger.log('Transaction updated', data);
    await this.appService.updateTransaction(data.id, data);
  }
}
