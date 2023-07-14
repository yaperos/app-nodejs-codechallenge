import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RetrieveTransactionQuery } from '../../../application/queries/retrieve-transaction.query';
import { RetrieveTransactionResponse } from './retrieve-transaction.response';

@Controller('transactions')
export class RetrieveTransactionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':transactionId')
  async retrieve(@Param('transactionId') transactionId: string) {
    const query = new RetrieveTransactionQuery(transactionId);
    const response = await this.queryBus.execute(query);
    return RetrieveTransactionResponse.toResponse(response);
  }
}
