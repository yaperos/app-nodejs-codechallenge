import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';

/* Project */
import { RetrieveTransactionQuery } from '../impl/retrieve-transaction.query';
import { RetrieveTransactionDto, TransactionResponseDto } from '../../dtos';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../repositories';
import { RetrieveTransactionTypeQuery } from '../../../transaction_types/queries';
import { TransactionType } from '../../../transaction_types/models';
import { validateDTOClass } from '../../../../common/helpers';
import {
  TRANSACTION_NOT_FOUND,
  TRANSACTION_TYPE_NOT_FOUND,
} from '../../../../common/constants/errors';

@QueryHandler(RetrieveTransactionQuery)
export class RetrieveTransactionHandler
  implements IQueryHandler<RetrieveTransactionQuery>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repo: ITransactionRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    query: RetrieveTransactionQuery,
  ): Promise<TransactionResponseDto> {
    const result = await validateDTOClass(
      RetrieveTransactionDto,
      query.payload,
      'Invalid transaction query',
    );

    if (result instanceof Error) {
      throw result;
    }

    const dto = result;

    const transaction = await this.repo.findById(dto.transactionId);

    if (!transaction) {
      throw TRANSACTION_NOT_FOUND;
    }

    const transactionType = await this.queryBus.execute<
      RetrieveTransactionTypeQuery,
      TransactionType
    >(new RetrieveTransactionTypeQuery(transaction.transferTypeId));

    if (!transactionType) {
      throw TRANSACTION_TYPE_NOT_FOUND;
    }

    return {
      transactionId: transaction.id,
      transactionType: {
        name: transactionType.name,
      },
      transactionStatus: { name: transaction.transactionStatusName },
      value: Number(transaction.value),
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
