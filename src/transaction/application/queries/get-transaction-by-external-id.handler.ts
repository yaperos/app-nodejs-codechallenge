import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TransactionRepositoryPort,
  TransactionRow,
} from '../ports/transaction.repository.port.js';
import { GetTransactionByExternalIdQuery } from './get-transaction-by-external-id.query.js';
import { TransactionResponseDto } from '../../presentation/dto/transaction-response.dto.js';

@QueryHandler(GetTransactionByExternalIdQuery)
export class GetTransactionByExternalIdHandler
  implements IQueryHandler<GetTransactionByExternalIdQuery, TransactionResponseDto>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async execute(
    query: GetTransactionByExternalIdQuery,
  ): Promise<TransactionResponseDto> {
    const row = await this.repository.findByExternalId(
      query.transactionExternalId,
    );
    if (!row) {
      throw new NotFoundException('Transaction not found');
    }
    return this.toDto(row);
  }

  private toDto(row: TransactionRow): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.transactionExternalId = row.transactionExternalId;
    dto.transactionType = { name: row.transferType.name };
    dto.transactionStatus = { name: row.status };
    dto.value = row.value;
    dto.createdAt = row.createdAt;
    return dto;
  }
}
