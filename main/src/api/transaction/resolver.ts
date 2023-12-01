import {
    Resolver,
    Args,
    Query,
    Mutation,
} from '@nestjs/graphql'
import { ClientKafka } from '@nestjs/microservices';
import { TransactionService } from 'src/core/transaction/service'
import { TransactionSqlRepository } from 'src/repos/transaction/repository';
import { Transaction, CreateTransactionPayload } from 'src/core/transaction/query'
import { RetrieveTransactionArgs, CreateTransactionArgs, DeleteTransactionArgs, SearchTransactionsArgs } from './request'
import { InternalServerErrorGraphQL } from 'src/core/errors';
import { Inject, OnModuleInit } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { DeleteTransactionPayload, TransactionConnection } from './response';

@Resolver(of => Transaction)
export class TransactionResolver implements OnModuleInit {
    private transactionService: TransactionService
    private producer: Producer
    constructor(
        @Inject('TRANSACTION_KAFKA')
        private client: ClientKafka,
        transactionRepository: TransactionSqlRepository
    ) {
        this.transactionService = new TransactionService(transactionRepository)

    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('transaction_topic');
        this.producer = await this.client.connect();
    }

    @Query(returns => Transaction, { name: 'transaction', nullable: true })
    async retrieveTransaction(
        @Args() args: RetrieveTransactionArgs
    ): Promise<Transaction> {
        const retrieveResponse = await this.transactionService.getById(args.id)

        if (!retrieveResponse.transaction) {
            return null
        } else if (retrieveResponse.error) {
            throw new InternalServerErrorGraphQL(retrieveResponse.error.message)
        }

        return Transaction.fromRawTransaction(retrieveResponse.transaction)
    }

    @Query(returns => TransactionConnection, {
        nullable: true,
        name: 'transactions',
    })
    async searchTransactions(
        @Args() args: SearchTransactionsArgs
    ): Promise<TransactionConnection> {
        const searchResponse = await this.transactionService.search({
            ...args,
            ids: args?.query?.ids,
            status: args?.query?.status,
        })
  
        if (searchResponse.error) {
            throw new InternalServerErrorGraphQL(searchResponse.error.message)
        }
        return TransactionConnection.fromApiResponse(searchResponse)
    }

    @Mutation(returns => CreateTransactionPayload, { nullable: true })
    async createTransaction(
        @Args() args: CreateTransactionArgs
    ): Promise<CreateTransactionPayload> {
        const createResponse = await this.transactionService.create(args.input)

        if (createResponse.error && createResponse.error.code === 'API_ERROR') {
            throw new InternalServerErrorGraphQL(createResponse.error.message)
        }
        
        const buffer = Buffer.from(JSON.stringify(createResponse.transaction));
        this.producer.send({
            topic: "transaction_topic",
            messages: [{
                value: buffer,
                partition: 0
            }]
        })
        
        return CreateTransactionPayload.fromApiResponse(createResponse)
    }

    @Mutation(returns => DeleteTransactionPayload, { nullable: true })
    async deleteTransaction(
        @Args() args: DeleteTransactionArgs
    ): Promise<DeleteTransactionPayload> {
        const deleteResponse = await this.transactionService.delete(args.id)

        if (deleteResponse.error && deleteResponse.error.code === 'API_ERROR') {
            throw new InternalServerErrorGraphQL(deleteResponse.error.message)
        }

        return DeleteTransactionPayload.fromApiResponse(deleteResponse)
    }
}
