import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateTransactionCommand } from '../application/create-transaction.command';
import { GetTransactionQuery } from '../application/get-transaction.query';
import { TransactionEventHandler } from '../application/handlers/transaction-event.handler';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { GetTransactionOutput } from './dto/get-transaction.output';
import { Transaction } from './entities/transaction.entity';

@Controller()
@Resolver(() => { Transaction })
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly transactionEventHandler: TransactionEventHandler) { }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput
  ) {
    return this.commandBus.execute(new CreateTransactionCommand(createTransactionInput));
  }

  @Query(() => GetTransactionOutput, { name: 'transaction' })
  async findOne(@Args('id') id: string) {
    return this.queryBus.execute(new GetTransactionQuery(id));
  }

  @MessagePattern('transaction.validated')
  handleTransactionValidated(@Payload() message: any) {
    this.transactionEventHandler.handleTransactionValidated(message);
  }
}
