import { Controller, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { TransactionDetailRequestDto } from 'src/dtos/transaction-detail-request.dto';
import { GetTransactionQuery } from 'src/queries/impl/get-transaction.query';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly appService: AppService,
  ) {}

  @MessagePattern('transaction.detail')
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

  @EventPattern('transaction.events')
  async handle(@Payload() data: any) {
    const { eventType, aggregateId, payload } = data;
    console.log({ eventType, aggregateId, payload });
    switch (eventType) {
      case 'transaction.created':
        await this.appService.createTransaction({
          id: aggregateId,
          ...payload,
        });
        break;
      case 'transaction.updated':
        await this.appService.updateTransaction(aggregateId, payload);
        break;
    }
  }
}
