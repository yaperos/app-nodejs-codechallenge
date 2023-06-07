import { Args, Query, Resolver } from "@nestjs/graphql";
import { Transaction } from "src/commands/domain/transaction.domain";
import { QueryBus } from "@nestjs/cqrs";
import { ValidationPipe } from "@nestjs/common";
import { GetTransactionObjectType } from "./objects/get-transaction.object-type";
import { TransactionMapper } from "./mappers/transaction.mapper";
import { GetTransactionInputType } from "./inputs/get-transaction.input-type";

@Resolver(of => Transaction)
export class TransactionResolver {
    constructor(private readonly queryBus: QueryBus,
    ) { }

    @Query(returns => GetTransactionObjectType)
    async getTransaction(@Args('filter', new ValidationPipe()) transactionInputType: GetTransactionInputType) {
        const getTransactionQuery = TransactionMapper.toQuery(transactionInputType);
        return TransactionMapper.toObjectType(await this.queryBus.execute(getTransactionQuery));
    }
}