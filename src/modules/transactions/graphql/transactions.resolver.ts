import { HttpStatus, Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiError } from 'src/common/api-errors/api-error';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { CreateTransactionRequestDTO } from '../dto/create-transaction-request.dto';
import { TransactionByIdResponseDTO } from '../dto/transaction-by-id-response.dto';
import { mapTransactionToTransactionByIdResponseDTO } from '../mappers/transaction.mapper';
import { TransactionsService } from '../services/transactions.service';

@Resolver()
export class TransactionsResolver {
  private readonly logger = new Logger(TransactionsResolver.name);
  constructor(private transactionService: TransactionsService) {}

  @Query((_) => TransactionByIdResponseDTO)
  async transaction(
    @Args('transactionId') transactionId: string,
  ): Promise<TransactionByIdResponseDTO> {
    let transaction: Transaction;
    try {
      transaction = await this.transactionService.getById(transactionId);
    } catch (error) {
      this.logger.error(error.message);
    }

    if (!transaction)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        `transaction with id (${transactionId}) not found`,
      );

    return mapTransactionToTransactionByIdResponseDTO(transaction);
  }

  @Mutation((_) => TransactionByIdResponseDTO)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionRequestDTO: CreateTransactionRequestDTO,
  ): Promise<TransactionByIdResponseDTO> {
    try {
      const transaction = await this.transactionService.create(
        createTransactionRequestDTO,
      );
      return mapTransactionToTransactionByIdResponseDTO(transaction);
    } catch (error: any) {
      this.logger.error(error.msg ?? error.message);
      throw error;
    }
  }
}
