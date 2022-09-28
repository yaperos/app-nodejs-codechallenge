import { Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ErrorMessage } from '../../domain/error';

import { InjectionToken } from '../injection.token';
import { FindTransactionByIdQuery } from './find-transaction-by-id.query';
import { FindTransactionByIdResult } from './find-transaction-by-id.result';
import { TransactionQuery } from './transaction.query';

@QueryHandler(FindTransactionByIdQuery)
export class FindTransactionByIdHandler implements IQueryHandler<FindTransactionByIdQuery, FindTransactionByIdResult> {
  constructor(@Inject(InjectionToken.TRANSACTION_QUERY) readonly transactionQuery: TransactionQuery) {}

  async execute(query: FindTransactionByIdQuery): Promise<FindTransactionByIdResult> {
    const data = await this.transactionQuery.findById(query.id);

    if (!data) throw new NotFoundException(ErrorMessage.TRANSACTION_IS_NOT_FOUND);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindTransactionByIdResult());
    if (dataKeys.length < resultKeys.length) throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey))) throw new InternalServerErrorException();

    return data;
  }
}
