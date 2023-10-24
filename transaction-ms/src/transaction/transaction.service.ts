import { Injectable, Logger } from "@nestjs/common";
import { PrismaSelect } from "@paljs/plugins";
import { PrismaService } from "nestjs-prisma";

import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

import { OperationHandlerService } from 'src/common/operations-handler/operations-handler.service';
import { CreateOneTransactionArgs } from "./entities/args/create-one-transaction.args";
import { TransactionMutationPayload } from "./entities/models/transaction-mutation.payload";

import { DeleteOneTransactionArgs } from "./entities/args/delete-one-transaction.args";
import { FindManyTransactionArgs } from "./entities/args/find-many-transaction.args";
import { UpdateOneTransactionStatusArgs } from "./entities/args/update-one-transaction-status.args";
import { UpdateOneTransactionArgs } from "./entities/args/update-one-transaction.args";
import { Transaction } from "./entities/models/transaction.model";
import { MessageBrokerDto } from "./kafka/dtos/message-broker.dto";
import { TransactionCreatedEvent } from "./kafka/events/transaction-created.event";

@Injectable()
export class TransactionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operationHandler: OperationHandlerService,
        @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka,
    ) {}

    async createTransaction(
        createOneTransactionArgs: CreateOneTransactionArgs,
        select: PrismaSelect
    ) {
        let deleteIdFromEnd = false;

        if (!(select as any)?.select.id) {
            (select as any).select.id = true;
            deleteIdFromEnd = true;
        }

        const transactionType = createOneTransactionArgs.data.transferTypeId;
        delete createOneTransactionArgs.data.transferTypeId;     

        const payload = new TransactionMutationPayload();

        let response = await this.operationHandler.handleAsync<
        TransactionMutationPayload,
        Transaction
        >(payload, async () =>
            this.prismaService.transaction.create({
                data: {
                    ...createOneTransactionArgs.data,
                    transactionType: {
                        connect: {
                            id: transactionType
                        },
                    },
                    transactionStatus: "PENDING"
                },
                ...select,
            }),
        );

        let event = new TransactionCreatedEvent(
            response.record.id,
            createOneTransactionArgs.data.accountExternalIdDebit,
            createOneTransactionArgs.data.accountExternalIdCredit,
            transactionType,
            createOneTransactionArgs.data.value,
        );

        if (deleteIdFromEnd) {
            delete response.record.id;
        }

        this.clientKafka.emit('transaction.created', new MessageBrokerDto(
            'transaction_created',
            new Date(),
            event
        ).toString());

        return response;
    }

    async findAll(
        findTransactionArgs: FindManyTransactionArgs,
        select: PrismaSelect,
    ) {
        return this.prismaService.transaction.findMany({
            ...findTransactionArgs,
            ...select,
        });
    }

    async updateTransaction(
        updateOneTransactionArgs: UpdateOneTransactionArgs,
        select: PrismaSelect,
    ) {
        const payload = new TransactionMutationPayload();
        return this.operationHandler.handleAsync<
        TransactionMutationPayload,
        Transaction
        >(payload, async () =>
            this.prismaService.transaction.update({
                data: {
                    ...updateOneTransactionArgs.data,
                    transactionType: {
                        connect: {
                            id: updateOneTransactionArgs.data.transferTypeId
                        }
                    }
                },
                where: {
                    ...updateOneTransactionArgs.where
                },
                ...select,
            }),
        );
    }

    async updateTransactionStatus(
        updateOneTransactionArgs: UpdateOneTransactionStatusArgs
    ) {
        try {
            await this.prismaService.transaction.update({
                data: {
                    transactionStatus: {
                        set: updateOneTransactionArgs.status
                    }
                },
                where: {
                    id: updateOneTransactionArgs.id
                },
            })
        } catch (error) {
            Logger.error(error);
        }
    }

    async removeTransaction(
        deleteOneTransactionArgs: DeleteOneTransactionArgs,
        select: PrismaSelect,
    ) {
        const payload = new TransactionMutationPayload();
        return this.operationHandler.handleAsync<
        TransactionMutationPayload,
        Transaction
        >(payload, async () =>
            this.prismaService.transaction.delete({
                ...deleteOneTransactionArgs,
                ...select,
            }),
        );
    }
    
}