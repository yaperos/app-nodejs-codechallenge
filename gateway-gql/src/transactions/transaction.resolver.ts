import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TransactionEntity } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver(() => TransactionEntity)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionEntity)
  createTransaction(
    @Args('createTransactionInput', { name: 'createTransactionInput' })
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => TransactionEntity, { nullable: true })
  findOne(
    @Args('transactionExternalId', { type: () => String, nullable: false })
    transactionExternalId: string,
  ) {
    return this.transactionService.getById(transactionExternalId);
  }
}
