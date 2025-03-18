import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ExternalTransaction } from './entities/external-transaction.entity';
import { CreateTransactionInput, FindOneTransactionInput } from './dto';
import { ClientKafka } from '@nestjs/microservices';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { TRANSACTION_SERVICE } from 'src/config';
import { lastValueFrom } from 'rxjs';
import { ExternalCreditAccount } from './entities/external-credit-account.entity';
import { ExternalDebitAccount } from './entities/external-debit-account.entity';

@Resolver(() => ExternalTransaction)
export class ExternalTransactionResolver implements OnModuleInit {
  private readonly logger = new Logger('ExternalTransactionResolver');

  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = [
      'find.all.transaction',
      'find.one.transaction',
      'create.transaction',
      'update.transaction',
      'remove.transaction',
      'find.all.external.credit.account',
      'find.all.external.debit.account',
    ];
    topics.forEach((topic) => {
      this.kafkaClient.subscribeToResponseOf(topic);
    });
    await this.kafkaClient.connect();
  }

  @Query(() => [ExternalTransaction], { name: 'transactions' })
  async findAll(): Promise<ExternalTransaction[]> {
    const response = await lastValueFrom(
      this.kafkaClient.send('find.all.transaction', ''),
    );

    return response?.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    }));
  }

  @Query(() => ExternalTransaction, { name: 'transaction' })
  async findOne(
    @Args('findOneTransactionInput')
    findOneTransactionInput: FindOneTransactionInput,
  ): Promise<ExternalTransaction> {
    const response: ExternalTransaction = await lastValueFrom(
      this.kafkaClient.send(
        'find.one.transaction',
        JSON.stringify(findOneTransactionInput),
      ),
    );

    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    };
  }

  @Mutation(() => ExternalTransaction, { name: 'createTransaction' })
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    const response = await lastValueFrom(
      this.kafkaClient.send(
        'create.transaction',
        JSON.stringify(createTransactionInput),
      ),
    );

    this.logger.log({ response });

    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    };
  }

  @Mutation(() => ExternalTransaction, { name: 'createTransaction' })
  async updateTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    const response = await lastValueFrom(
      this.kafkaClient.send(
        'create.transaction',
        JSON.stringify(createTransactionInput),
      ),
    );

    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    };
  }

  @Query(() => [ExternalCreditAccount], { name: 'externalCreditAccounts' })
  async findAllExternalCreditAccount(): Promise<ExternalCreditAccount[]> {
    const response = await lastValueFrom(
      this.kafkaClient.send('find.all.external.credit.account', ''),
    );

    return response?.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    }));
  }

  @Query(() => [ExternalDebitAccount], { name: 'externalDebitAccounts' })
  async findAllExternalDebitAccount(): Promise<ExternalDebitAccount[]> {
    const response = await lastValueFrom(
      this.kafkaClient.send('find.all.external.debit.account', ''),
    );

    return response?.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: t.updatedAt ? new Date(t.updatedAt) : undefined,
    }));
  }
}
