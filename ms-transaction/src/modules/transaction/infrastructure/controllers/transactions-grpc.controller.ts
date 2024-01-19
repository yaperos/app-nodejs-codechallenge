import {
  Controller,
  HttpStatus,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'src/modules/shared/infrastructure/filters/grpc-exception.filter';
import { CreateTransactionCommand } from 'src/modules/transaction/application/commands/create-transaction.command';
import { PaginatedTransactionsOutput } from 'src/modules/transaction/application/dtos/paginated-transactions.output';
import { GetPaginatedTransactionsQuery } from 'src/modules/transaction/application/queries/get-paginated-transactions.query';
import { GetTransactionQuery } from 'src/modules/transaction/application/queries/get-transaction.query';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

import { CreateTransactionRequestDto } from '../dtos/create-transaction-request.dto';
import { FindOneTransactionRequestDto } from '../dtos/find-one-transaction-request.dto';
import { FindPaginatedRequestDto } from '../dtos/find-paginated-request.dto';
import { PaginatedTransactionsResponseDto } from '../dtos/paginated-transactions-response.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';
import { TransactionCacheInterceptor } from '../interceptors/transaction-cache.interceptor';

@UseFilters(new GrpcExceptionFilter())
@Controller()
export class TransactionsGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('Transaction')
  async findPaginated(
    @Payload() findPaginatedRequest: FindPaginatedRequestDto,
  ): Promise<PaginatedTransactionsResponseDto> {
    const paginatedTransactions: PaginatedTransactionsOutput =
      await this.queryBus.execute(
        new GetPaginatedTransactionsQuery(
          TransactionCriteria.fromRequestValues({ ...findPaginatedRequest }),
        ),
      );

    return {
      code: HttpStatus.OK,
      data: paginatedTransactions,
    };
  }

  @UseInterceptors(TransactionCacheInterceptor)
  @GrpcMethod('Transaction')
  async findOne(
    @Payload() findOneRequest: FindOneTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const transactionOutput = await this.queryBus.execute(
      new GetTransactionQuery(
        TransactionCriteria.createById(findOneRequest.id),
      ),
    );

    return {
      code: HttpStatus.OK,
      data: transactionOutput,
    } as TransactionResponseDto;
  }

  @GrpcMethod('Transaction')
  async create(
    @Payload() createTransactionRequest: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const transactionOutput = await this.commandBus.execute(
      new CreateTransactionCommand(
        createTransactionRequest.id,
        createTransactionRequest.creditAccountExternalId,
        createTransactionRequest.debitAccountExternalId,
        createTransactionRequest.amount,
        createTransactionRequest.transferType,
      ),
    );

    return {
      code: HttpStatus.CREATED,
      data: transactionOutput,
    } as TransactionResponseDto;
  }
}
