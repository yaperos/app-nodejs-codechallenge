import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Transaction } from "../objects/transaction";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionInput } from "src/objects/inputs/create-transaction.input";
import { UseFilters, ValidationPipe } from "@nestjs/common";
import { GqlImplExceptionFilter } from "src/configuration/filters/gql-exception.filter";

@UseFilters(GqlImplExceptionFilter)
@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => Transaction)
  findById(@Args("id", { type: () => String }, ValidationPipe) id: string) {
    return this.transactionService.findById(id);
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Args("createTransaction") createTransaction: CreateTransactionInput
  ) {
    return this.transactionService.save(createTransaction);
  }
}
