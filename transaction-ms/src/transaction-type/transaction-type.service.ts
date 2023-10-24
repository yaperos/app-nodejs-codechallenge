import { Injectable } from "@nestjs/common";
import { PrismaSelect } from '@paljs/plugins';
import { PrismaService } from "nestjs-prisma";
import { OperationHandlerService } from 'src/common/operations-handler/operations-handler.service';
import { CreateOneTransactionTypeArgs } from "./entities/args/create-one-transaction-type.args";
import { DeleteOneTransactionTypeArgs } from "./entities/args/delete-one-transaction-type.args";
import { FindManyTransactionTypeArgs } from "./entities/args/find-many-transaction-type.args";
import { TransactionTypeMutationPayload } from "./entities/models/transaction-type-mutation.payload";
import { TransactionType } from "./entities/models/transaction-type.model";

@Injectable()
export class TransactionTypeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operationHandler: OperationHandlerService,
    ) {}

    async createTransactionType(
        createTransactionTypeArgs: CreateOneTransactionTypeArgs,
        select: PrismaSelect
    ) {
        const payload = new TransactionTypeMutationPayload();
        return this.operationHandler.handleAsync<
        TransactionTypeMutationPayload,
        TransactionType
        >(payload, async () =>
            this.prismaService.transactionType.create({
                ...createTransactionTypeArgs,
                ...select,
            }),
        );
    }

    async findAll(
        findTransactionTypeArgs: FindManyTransactionTypeArgs,
        select: PrismaSelect,
    ) {
        return this.prismaService.transactionType.findMany({
            ...findTransactionTypeArgs,
            ...select,
        });
    }

    async remove(
        deleteOneTransactionTypeArgs: DeleteOneTransactionTypeArgs,
        select: PrismaSelect,
    ) {
        const payload = new TransactionTypeMutationPayload();
        return this.operationHandler.handleAsync<
        TransactionTypeMutationPayload,
        TransactionType
        >(payload, async () =>
            this.prismaService.transactionType.delete({
                ...deleteOneTransactionTypeArgs,
                ...select,
            }),
        );
    }
}