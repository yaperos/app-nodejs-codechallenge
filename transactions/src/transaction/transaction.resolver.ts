import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAntiFraudServiceDto } from './dto/create-anti-fraud-service.dto';
import { logger } from '../datadog';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction, { name: 'create' })
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => Transaction, { name: 'findById' })
  async findById(@Args('transactionId') transactionId: string) {
    logger.log('info', {
      message: 'get transactions by id',
      transactionId,
    });
    const result = await this.transactionService.getById(transactionId);
    return result;
  }
}
