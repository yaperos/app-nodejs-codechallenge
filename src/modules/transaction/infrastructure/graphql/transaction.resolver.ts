import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateTransactionInput } from '@/modules/transaction/infrastructure/graphql/dto/create-transaction.input';
import { TransactionOutput } from '@/modules/transaction/infrastructure/graphql/dto/transaction.output';
import { CreateTransactionUseCase } from '@/modules/transaction/application/use-cases/create-transaction.use-case';
import { FindTransactionUseCase } from '@/modules/transaction/application/use-cases/find-transaction.use-case';
import { toTransactionOutput } from '@/modules/transaction/infrastructure/graphql/dto/transaction.mapper';

@Resolver(() => TransactionOutput)
export class TransactionResolver {
  constructor(
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly findTransaction: FindTransactionUseCase,
  ) {}

  @Mutation(() => TransactionOutput)
  async createTransactionMutation(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionOutput> {
    const transactionWithRelations = await this.createTransaction.execute(input);
    return toTransactionOutput(transactionWithRelations);
  }

  @Query(() => TransactionOutput)
  async getTransaction(@Args('id') id: string): Promise<TransactionOutput> {
    const transactionWithRelations = await this.findTransaction.execute(id);
    return toTransactionOutput(transactionWithRelations);
  }
}