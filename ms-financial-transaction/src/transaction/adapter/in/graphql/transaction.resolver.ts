import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionService } from '../../../../transaction/service/create-transaction.service';
import { CreateTransactionInputDto } from '../../../dto/create-transaction-input.dto';
import { CreateTransactionOutputDto } from '../../../dto/create-transaction-output.dto';
import { GetTransactionsService } from '../../../../transaction/service/get-transactions.service';
import { GetTransactionOutputDto } from '../../../../transaction/dto/get-transaction-output.dto';
import { Logger } from 'nestjs-pino';

@Resolver()
export class TransactionResolver {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly getTransactionsService: GetTransactionsService,
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CreateTransactionOutputDto)
  async createTransaction(
    @Args('input') input: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    this.logger.debug('Creating transaction');
    return await this.createTransactionService.create(input);
  }

  @Query(() => GetTransactionOutputDto)
  async getTransactionById(
    @Args('id') id: string,
  ): Promise<GetTransactionOutputDto> {
    this.logger.debug({ id }, 'Searching transaction with id');
    const transaction = await this.getTransactionsService.getById(id);
    this.logger.debug('Transaction found');
    return {
      transactionExternalId: transaction.id,
      value: transaction.amount,
      transactionStatus: {
        name: transaction.status,
      },
      transactionType: { name: transaction.type },
      createdAt: transaction.createdAt.toLocaleString('es-PE'),
    };
  }
}
