import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './models/transaction.model';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FindTransactionOutput } from './dto/find-transaction.output';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionService.findAll();
  }

  @Query(() => FindTransactionOutput, { name: 'transaction', nullable: true })
  async findOne(@Args('id') id: string): Promise<FindTransactionOutput | null> {
    return await this.transactionService.findById(id);
  }
}
