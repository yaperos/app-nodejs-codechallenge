import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventPattern, Payload } from "@nestjs/microservices";
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { CreateTransactionCommand } from '../application/commands/create-transaction.command';
import { TransactionEventHandler } from '../application/handlers/transaction-event.handler';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Controller()
@Resolver(() => { TransactionEntity })
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly transactionEventHandler: TransactionEventHandler) { }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => TransactionEntity)
  createTransaction(@Args('createTransactionInput') createTransactionDto: CreateTransactionDto) {
    return this.commandBus.execute(new CreateTransactionCommand(createTransactionDto));
  }

  @EventPattern('transaction.validated')
  updateTransactionWriteDB(@Payload() message: MessageBrokerDto<Object>) {
    this.transactionEventHandler.updateTransactionWriteDB(message.content);
  }
}
