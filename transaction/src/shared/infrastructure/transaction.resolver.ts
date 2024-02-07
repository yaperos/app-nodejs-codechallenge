import { TransactionCreateService } from 'src/create/infra/transaction.create.service';
import { TransactionCreateInputDto } from 'src/create/infra/transaction.create.dto';
import { TransactionFindService } from 'src/find/infra/transaction.find.service';
import {
  TransactionFindInputDto,
  TransactionQuery,
} from 'src/find/infra/transaction.find.dto';
import { TransactionToQueryResult } from './transaction.mapper';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(
    private readonly findService: TransactionFindService,
    private readonly createService: TransactionCreateService,
  ) {}

  @Mutation(() => TransactionQuery)
  public async create(@Args('input') input: TransactionCreateInputDto) {
    const createdTransaction = await this.createService.handle(input);
    return TransactionToQueryResult.handle(createdTransaction);
  }

  @Query(() => TransactionQuery, { nullable: true })
  public async getById(
    @Args('input') { id }: TransactionFindInputDto,
  ): Promise<TransactionQuery | null> {
    const transaction = await this.findService.byId(id);
    return transaction ? TransactionToQueryResult.handle(transaction) : null;
  }
}
