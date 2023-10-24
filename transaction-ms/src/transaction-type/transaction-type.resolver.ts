import { Args, Info, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql/type/definition";

import { OperationHandlerService } from "src/common/operations-handler/operations-handler.service";

import { CreateOneTransactionTypeArgs } from "./entities/args/create-one-transaction-type.args";
import { TransactionTypeMutationPayload } from "./entities/models/transaction-type-mutation.payload";
import { TransactionType } from "./entities/models/transaction-type.model";

import { DeleteOneTransactionTypeArgs } from "./entities/args/delete-one-transaction-type.args";
import { FindManyTransactionTypeArgs } from "./entities/args/find-many-transaction-type.args";
import { TransactionTypeService } from "./transaction-type.service";

@Resolver(()=>TransactionType)
export class TransactionTypeResolver {
    constructor(
        private readonly transactionTypeService: TransactionTypeService,
        private readonly operationHandler: OperationHandlerService,
    ) {}

    @Mutation(() => TransactionTypeMutationPayload)
    async createTransactionType(
        @Args() createTransactionTypeArgs: CreateOneTransactionTypeArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<TransactionTypeMutationPayload> {
        return this.transactionTypeService.createTransactionType(
            createTransactionTypeArgs,
            this.operationHandler.handleSelect(
                info,
                TransactionType.DEFAULT_FIELDS,
                TransactionType.MODEL_NAME,
            ),
        );
    }

    @Query(() => [TransactionType], { name: 'transactionTypes' })
    findAll(
        @Args() findManyTransactionTypeArgs: FindManyTransactionTypeArgs,
        @Info() info: GraphQLResolveInfo,
    ) {
        return this.transactionTypeService.findAll(
            findManyTransactionTypeArgs,
            this.operationHandler.handleSelect(
                info,
                TransactionType.DEFAULT_FIELDS,
                TransactionType.MODEL_NAME,
            ),
        );
    }

    @Mutation(() => TransactionTypeMutationPayload)
    removeTransactionType(
        @Args() deleteOneTransactionTypeArgs: DeleteOneTransactionTypeArgs,
        @Info() info: GraphQLResolveInfo,
    ): Promise<TransactionTypeMutationPayload> {
        return this.transactionTypeService.remove(
            deleteOneTransactionTypeArgs,
            this.operationHandler.handleSelect(
                info,
                TransactionType.DEFAULT_FIELDS,
                TransactionType.MODEL_NAME,
            ),
        );
    }
}