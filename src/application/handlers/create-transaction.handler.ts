import { Injectable } from '@nestjs/common';
import { CreateTransactionUseCase } from '@domain/use-cases/create-transaction.use-case';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class CreateTransactionHandler {
  constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

  async handle(
    dto: CreateTransactionDto,
    correlationId?: string,
  ): Promise<TransactionResponseDto> {
    const params = TransactionMapper.toCreateParams(dto);
    const transaction = await this.createTransactionUseCase.execute(params, correlationId);
    return TransactionMapper.toResponseDto(transaction);
  }
} 