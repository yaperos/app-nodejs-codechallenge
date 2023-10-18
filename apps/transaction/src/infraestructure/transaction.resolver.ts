import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventPattern, Payload } from "@nestjs/microservices";
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { CreateTransactionCommand } from '../application/commands/create-transaction.command';
import { TransactionEventHandler } from '../application/handlers/transaction-event.handler';
import { GetTransactionQuery } from '../application/queries/get-transaction.query';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Controller()
@Resolver(() => { TransactionEntity })
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly transactionEventHandler: TransactionEventHandler) { }

  @Mutation(() => TransactionEntity)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionDto: CreateTransactionDto
  ) {
    return this.commandBus.execute(new CreateTransactionCommand(createTransactionDto));
  }

  @Query(() => GetTransactionDto, { name: 'transaction' })
  async findOne(@Args('id') id: string) {
    return this.queryBus.execute(new GetTransactionQuery(id));
  }

  @EventPattern('transaction.validated')
  updateTransactionWriteDB(@Payload() message: MessageBrokerDto<Object>) {
    this.transactionEventHandler.updateTransactionWriteDB(message.content);
  }

  @EventPattern('transaction.validated')
  updateTransactionReadDB(@Payload() message: MessageBrokerDto<Object>) {
    this.transactionEventHandler.updateTransactionReadDB(message.content);
  }

  @EventPattern('transaction.created')
  createTransactionReadDB(@Payload() message: MessageBrokerDto<any>) {
    this.transactionEventHandler.createTransactionReadDB(message.content);
  }
}
