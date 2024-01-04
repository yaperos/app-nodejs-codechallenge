import { HttpService } from '@nestjs/axios';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { lastValueFrom } from 'rxjs';
import { Transaction } from '../entities/transaction.entitie';
import { CreateTransactionDto } from '../dto/createTransaction.dto';

@Resolver()
export class TransactionResolver {
  constructor(private httpService: HttpService) {}
  @Query(() => String)
  transaction(): string {
    return 'Hello World';
  }
  @Mutation(() => Transaction, { name: 'createTransaction' })
  async createTransaction(
    @Args('createTransaction') createTransaction: CreateTransactionDto,
  ): Promise<Transaction> {
    const { data: result } = await lastValueFrom(
      this.httpService.post(
        `${process.env.TRANSACTION_URL}/transaction`,
        createTransaction,
      ),
    );
    return result;
  }
}
