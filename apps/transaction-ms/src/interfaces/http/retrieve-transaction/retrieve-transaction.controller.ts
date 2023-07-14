import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RetrieveTransactionQuery } from 'apps/transaction-ms/src/application/queries/retrieve-transaction.query';

@Controller('transactions')
export class RetrieveTransactionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':transactionId')
  async retrieve(@Param('transactionId') transactionId: string) {
    const query = new RetrieveTransactionQuery(transactionId);
    return this.queryBus.execute(query);
  }
}
