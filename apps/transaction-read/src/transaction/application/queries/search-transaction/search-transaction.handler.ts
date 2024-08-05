import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchTransactionResponse } from '../../dtos/search-transaction.dto';
import { TransactionFilters } from '../../../domain/filters/transaction-filters';
import { ITransactionRepository } from '../../../domain/repositories/itransaction.repository';
import { Inject } from '@nestjs/common';
import { SearchTransactionQuery } from './search-transaction.query';

@QueryHandler(SearchTransactionQuery)
export class SearchTransactionHandler
  implements IQueryHandler<SearchTransactionQuery>
{
  constructor(
    @Inject('ITransactionRepository')
    private readonly iTransactionRepository: ITransactionRepository,
  ) {}

  async execute(
    request: SearchTransactionQuery,
  ): Promise<SearchTransactionResponse[]> {
    const filters = this.mapInputToFilters(request);
    const transactions =
      await this.iTransactionRepository.findByFilters(filters);

    return transactions.map((transaction) => ({
      transactionExternalId: transaction.getTransactionExternalId(),
      accountExternalIdDebit: transaction.getAccountExternalIdDebit(),
      accountExternalIdCredit: transaction.getAccountExternalIdCredit(),
      value: transaction.getValue(),
      createdAt: transaction.getCreatedAt(),
      transactionType: transaction.getTransactionType().getName(),
      transactionStatus: transaction.getTransactionStatus().getName(),
    }));
  }

  private mapInputToFilters(input: SearchTransactionQuery): TransactionFilters {
    return {
      transactionExternalId:
        input.searchTransactionRequest.transactionExternalId,
      value: input.searchTransactionRequest.value,
      createdAt: input.searchTransactionRequest.createdAt,
      transactionType: input.searchTransactionRequest.transactionType
        ? { name: input.searchTransactionRequest.transactionType.name }
        : undefined,
      transactionStatus: input.searchTransactionRequest.transactionStatus
        ? { name: input.searchTransactionRequest.transactionStatus.name }
        : undefined,
    };
  }
}
