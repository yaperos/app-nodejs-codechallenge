import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

/* Extra */
import { firstValueFrom } from 'rxjs';

/* Project */
import { CreateTransactionInput, RetrieveTransactionInput } from './dtos';
import { Transaction } from './models';
import { TransactionService } from './interfaces';
import { TransactionProto } from '../../constants/grpc.constants';

@Resolver(() => Transaction)
export class TransactionResolver implements OnModuleInit {
  private transactionService: TransactionService;

  constructor(
    @Inject(TransactionProto.service)
    private readonly transactionClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.transactionService =
      this.transactionClient.getService<TransactionService>(
        TransactionProto.proto.service,
      );
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    return await firstValueFrom(
      this.transactionService.CreateTransaction(input),
    );
  }

  @Query(() => Transaction)
  async retrieveTransaction(
    @Args('input') input: RetrieveTransactionInput,
  ): Promise<Transaction> {
    return await firstValueFrom(
      this.transactionService.RetrieveTransaction(input),
    );
  }
}
