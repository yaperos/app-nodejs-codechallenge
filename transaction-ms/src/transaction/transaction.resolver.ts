import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { OperationHandlerService } from "src/common/operations-handler/operations-handler.service";
import { TransactionService } from "./transaction.service";

import { GraphQLResolveInfo } from "graphql/type/definition";
import { CreateOneTransactionArgs } from "./entities/args/create-one-transaction.args";
import { DeleteOneTransactionArgs } from "./entities/args/delete-one-transaction.args";
import { FindManyTransactionArgs } from "./entities/args/find-many-transaction.args";
import { UpdateOneTransactionArgs } from "./entities/args/update-one-transaction.args";
import { TransactionMutationPayload } from "./entities/models/transaction-mutation.payload";

import { TransactionStatusType } from "./entities/models/transaction-status.model";
import { Transaction } from "./entities/models/transaction.model";


@Resolver(()=>Transaction)
export class TransactionResolver {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly operationHandler: OperationHandlerService
    ) {}

    @ResolveField(() => String, { nullable: true })
    transactionExternalId(
        @Parent() transaction: Transaction,
        @Info() info: GraphQLResolveInfo
    ) {
        return transaction.id
    }

    @ResolveField(() => TransactionStatusType)
    transactionStatus(
        @Parent() transaction: Transaction,
        @Info() info: GraphQLResolveInfo
    ) {
        const transactionStatus = new TransactionStatusType();
        transactionStatus.name = transaction.transactionStatus;
        return transactionStatus;
    }

    @Mutation(() => TransactionMutationPayload)
    async createTransaction(
        @Args() createOneTransactionArgs: CreateOneTransactionArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<TransactionMutationPayload> {
        return this.transactionService.createTransaction(
            createOneTransactionArgs,
            this.operationHandler.handleSelect(
                info,
                Transaction.DEFAULT_FIELDS,
                Transaction.MODEL_NAME,
            ),
        );
    }

    @Query(() => [Transaction], { name: 'transactions' })
    findAll(
        @Args() findManyTransactionArgs: FindManyTransactionArgs,
        @Info() info: GraphQLResolveInfo,
    ) {
        return this.transactionService.findAll(
            findManyTransactionArgs,
            this.operationHandler.handleSelect(
                info,
                Transaction.DEFAULT_FIELDS,
                Transaction.MODEL_NAME,
            ),
        );
    }

    @Mutation(() => TransactionMutationPayload)
    updateTransaction(
        @Args() updateOneTransactionArgs: UpdateOneTransactionArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<TransactionMutationPayload> {
        return this.transactionService.updateTransaction(
            updateOneTransactionArgs,
            this.operationHandler.handleSelect(
                info,
                Transaction.DEFAULT_FIELDS,
                Transaction.MODEL_NAME,
            ),
        );
    }

    @Mutation(() => TransactionMutationPayload)
    removeTransaction(
        @Args() deleteOneTransactionArgs: DeleteOneTransactionArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<TransactionMutationPayload> {
        return this.transactionService.removeTransaction(
            deleteOneTransactionArgs,
            this.operationHandler.handleSelect(
                info,
                Transaction.DEFAULT_FIELDS,
                Transaction.MODEL_NAME,
            ),
        );
    }
}