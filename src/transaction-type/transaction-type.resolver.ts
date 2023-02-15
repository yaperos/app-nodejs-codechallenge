import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionType } from './transaction-type.entity';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';

@Resolver(() => TransactionType)
export class TransactionTypeResolver {
  constructor(private readonly transactionTypeService: TransactionTypeService) {}

  @Mutation(() => TransactionType)
  createTransactionType(@Args('createTransactionTypeInput') createTransactionTypeInput: CreateTransactionTypeInput) {
    return this.transactionTypeService.create(createTransactionTypeInput);
  }

  @Query(() => [TransactionType], { name: 'transactionType' })
  findAll() {
    return this.transactionTypeService.findAll();
  }

  @Query(() => TransactionType, { name: 'transactionType' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionTypeService.findOne(id);
  }

  @Mutation(() => TransactionType)
  updateTransactionType(@Args('updateTransactionTypeInput') updateTransactionTypeInput: UpdateTransactionTypeInput) {
    return this.transactionTypeService.update(updateTransactionTypeInput.id, updateTransactionTypeInput);
  }

  @Mutation(() => TransactionType)
  removeTransactionType(@Args('id', { type: () => Int }) id: number) {
    return this.transactionTypeService.remove(id);
  }
}
