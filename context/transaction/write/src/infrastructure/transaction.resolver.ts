import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CommandBus } from "@nestjs/cqrs";
import { Controller } from "@nestjs/common";
import { CreateTransactionCommand } from "../application/commands/create-transaction.command";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MessageBrokerDto } from "./dto/message-broker.dto";
import { TransactionEntity } from "./entities/transaction.entity";
import { TransactionEventHandler } from "../application/handlers/transaction-event.handler";

@Controller()
@Resolver(() => {
  TransactionEntity;
})
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly transactionEventHandler: TransactionEventHandler,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return "Hello World!";
  }

  @Mutation(() => TransactionEntity)
  createTransaction(
    @Args("createTransactionInput") createTransactionDto: CreateTransactionDto,
  ) {
    return this.commandBus.execute(
      new CreateTransactionCommand(createTransactionDto),
    );
  }

  @EventPattern("transaction.validated")
  updateTransactionWriteDB(@Payload() message: MessageBrokerDto<object>) {
    this.transactionEventHandler.updateTransactionWriteDB(message.content);
  }
}
