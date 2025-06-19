import { Injectable, NotFoundException } from '@nestjs/common';
import { GetTransactionUseCase } from '@domain/use-cases/get-transaction.use-case';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class GetTransactionHandler {
  constructor(private readonly getTransactionUseCase: GetTransactionUseCase) {}

  async handle(
    transactionExternalId: string,
    correlationId?: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.getTransactionUseCase.execute(
      transactionExternalId,
      correlationId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionExternalId} not found`,
      );
    }

    return TransactionMapper.toResponseDto(transaction);
  }
} 