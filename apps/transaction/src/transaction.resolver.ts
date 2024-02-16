import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionModel } from './models/transaction.model';
import { FindTransactionDto } from './dto/find.dto';
import { CreateTransactionDto } from './dto/create.dto';
import { TransactionService } from './transaction.service';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { TRANSACTION_CREATED_EVENT_TOPIC } from '../../../libs/shared-constants';

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('ANTI_FRAUD_SERVICE') private readonly eventEmitter: ClientKafka,
  ) {}

  @Query(() => TransactionModel)
  findTransactionById(@Args() { transactionExternalId }: FindTransactionDto) {
    return this.transactionService.findTransactionById(transactionExternalId);
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Args('createTransactionDto')
    payload: CreateTransactionDto,
  ): Promise<Partial<TransactionModel>> {
    const createdTransaction =
      await this.transactionService.createTransaction(payload);

    this.eventEmitter.emit(
      TRANSACTION_CREATED_EVENT_TOPIC,
      JSON.stringify({
        value: createdTransaction.value,
        transactionExternalId: createdTransaction.transactionExternalId,
      }),
    );

    return createdTransaction;
  }
}
