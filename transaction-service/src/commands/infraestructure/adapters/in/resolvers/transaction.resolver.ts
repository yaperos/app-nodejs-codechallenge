import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Transaction } from "src/commands/domain/transaction.domain";
import { NewTransactionInputType } from "./inputs/new-transaction.input-type";
import { TransactionObjectType } from "./objects/transaction.object-type";
import { TransactionMapper } from "./mappers/transaction.mapper";
import { CommandBus } from "@nestjs/cqrs";
import { ValidationPipe } from "@nestjs/common";

@Resolver(of => Transaction)
export class TransactionResolver {
    delay: any;
    constructor(private readonly commandBus: CommandBus,
    ) {
    }

    @Mutation(returns => TransactionObjectType)
    async createTransaction(@Args('transaction', new ValidationPipe()) transactionInputType: NewTransactionInputType) {
        const createTransactionCommand = TransactionMapper.toCommand(transactionInputType);
        return TransactionMapper.toObjectType(await this.commandBus.execute(createTransactionCommand));
    }
}