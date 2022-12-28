import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TransactionInfrastructure } from '../../infrastructure/transaction.infrastructure';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { GetTransactionDto } from '../dtos/get-transaction.dto';

export class GetTransactionQuery implements IQuery {
  constructor(public readonly transactionExternalId: string) {}
}

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery, GetTransactionDto>
{
  constructor(
    @Inject(TransactionInfrastructure)
    private repository: TransactionRepository,
  ) {}
  async execute(query: GetTransactionQuery): Promise<GetTransactionDto> {
    const transaction = await this.repository.findById(
      query.transactionExternalId,
    );
    console.log(transaction,'query')
    return GetTransactionDto.fromDomainToResponse(transaction);
  }
}
