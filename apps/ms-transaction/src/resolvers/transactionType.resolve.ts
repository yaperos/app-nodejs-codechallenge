import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionType } from '../models';
import { TransactionTypeService } from '../services';
import { CreateTransactionTypeDto } from '../dto';

@Resolver((of) => TransactionType)
export class TransactionTypeResolver {
  constructor(private transactionTypeService: TransactionTypeService) {}

  @Query((returns) => [TransactionType])
  transactionsType(): Promise<TransactionType[]> {
    return this.transactionTypeService.findAll();
  }

  @Query(() => TransactionType, { name: 'transactionTypeFindOne' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TransactionType> {
    return this.transactionTypeService.findOne(id);
  }

  @Mutation((returns) => TransactionType)
  createTransactionType(
    @Args('createTransactionTypeInput')
    createTransactionTypeInput: CreateTransactionTypeDto,
  ): Promise<TransactionType> {
    return this.transactionTypeService.save(createTransactionTypeInput);
  }
}
