import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionInput } from '../dto/inputs/create-transaction.input';
import { UpdateTransactionInput } from '../dto/inputs/update-transaction.input';
import { TransformedTransaction } from '../dto/responses/transformed-transaction-response.dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../services/transaction.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => [TransformedTransaction], { name: 'transactions' })
  findAll() {
    return this.transactionService.findAll();
  }

  @Query(() => TransformedTransaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.transactionService.findOne(id);
  }

  @Mutation(() => Transaction)
  updateTransaction(@Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput) {
    return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
  }
}
