import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from "./transaction.service";
import { Transaction } from "./entities/transaction";
import { CreateTransactionInput } from "./dto/create-transaction.input";

@Resolver(() => Transaction)
export class TransactionResolver {
    constructor(
        private readonly transactionService: TransactionService
    ) {}

    @Query(() => [Transaction])
    async transactions() {
      return this.transactionService.findAll();
    }

    @Query(() => Transaction)
    async transaction(@Args('id') id: string) {
        return this.transactionService.findById(id);
    }

    @Mutation(() => Transaction)
    createTransaction(
        @Args('transactionInput') transactionInput: CreateTransactionInput,
    ) {
        return this.transactionService.create(transactionInput)
    }
}