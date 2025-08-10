import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

/* Project */
import {
  CreateTransactionDto,
  RetrieveTransactionDto,
  TransactionResponseDto,
} from './dtos';
import { CreateTransactionCommand } from './commands/impl/create-transaction.command';
import { RetrieveTransactionQuery } from './queries/impl/retrieve-transaction.query';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createTransaction(
    payload: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log('Creating transaction...');
    return await this.commandBus.execute(new CreateTransactionCommand(payload));
  }

  async retrieveTransaction(
    payload: RetrieveTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Retrieving transaction ${payload.transactionId}`);
    return await this.queryBus.execute(new RetrieveTransactionQuery(payload));
  }
}
