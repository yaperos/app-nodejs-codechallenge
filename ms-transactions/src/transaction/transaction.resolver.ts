import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Logger } from '@nestjs/common';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  async createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    try {
      const createdTransaction = await this.transactionService.create(createTransactionInput);
      return createdTransaction;
    } catch (error) {
      throw new Error('Error creating transaction');
    }
  }
  
  @Query(() => [Transaction], { name: 'transaction' })
  findAll() {
    return this.transactionService.findAll();
  }

}
