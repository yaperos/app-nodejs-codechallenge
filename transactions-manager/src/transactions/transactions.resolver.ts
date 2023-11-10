import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../database/entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Any } from 'typeorm';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction])
  getTransactions() {
    return this.transactionsService.findAll();
  }

  @Query(() => Transaction)
  getOneTransaction(@Args('uuid') uuid: string) {
    return this.transactionsService.findOne(uuid);
  }

  @Mutation(() => Boolean)
  updateTransaction(
    @Args('updateTransactionDTO') updateTransactionDTO: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(updateTransactionDTO);
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionDTO') createTransactionDTO: CreateTransactionDto,
  ) {
    return this.transactionsService.create(createTransactionDTO);
  }
}
