import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionType } from './entities/transaction-type.entity';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Resolver(() => TransactionType)
export class TransactionTypeResolver {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Mutation(() => TransactionType)
  createTransactionType(
    @Args('createTransactionTypeInput')
    createTransactionTypeInput: CreateTransactionTypeInput,
  ) {
    return this.transactionTypeService.create(createTransactionTypeInput);
  }

  @Query(() => [TransactionType], { name: 'transactionTypes' })
  findAll() {
    return this.transactionTypeService.findAll();
  }

  @ResolveField(() => [Transaction])
  transaction(@Parent() transactionType: TransactionType) {
    return this.transactionTypeService.getTransaction(transactionType.id);
  }

  @Query(() => TransactionType, { name: 'transactionType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionTypeService.findOne(id);
  }

  @Mutation(() => TransactionType)
  updateTransactionType(
    @Args('updateTransactionTypeInput')
    updateTransactionTypeInput: UpdateTransactionTypeInput,
  ) {
    return this.transactionTypeService.update(
      updateTransactionTypeInput.id,
      updateTransactionTypeInput,
    );
  }
}
