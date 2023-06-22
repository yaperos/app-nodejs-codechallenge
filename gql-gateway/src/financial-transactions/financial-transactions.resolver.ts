/* eslint-disable prettier/prettier */

import { Resolver, Mutation, Query } from '@nestjs/graphql'
import { Args } from '@nestjs/graphql'
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateTransactionRequest, CreateTransactionResponse, TransactionResponse } from './financial-transactions.schema';
import { CREATE_TRANSACTION_TOPIC, FIND_TRANSACTION_TOPIC } from 'src/constans/kafka-topics';


@Resolver()
export class FinancialTransactionsResolver implements OnModuleInit {

    onModuleInit() {
        this.kafkaClient.subscribeToResponseOf(CREATE_TRANSACTION_TOPIC);
        this.kafkaClient.subscribeToResponseOf(FIND_TRANSACTION_TOPIC);

    }

    constructor(
        @Inject('FINANCIAL_TRANSACTIONS_MICROSERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    @Query(() => TransactionResponse)
    async getTransactionByExternalId(
        @Args('transactionExternalId')
        transactionExternalId: string
    ) {
        const result = await firstValueFrom(this.kafkaClient
            .send(FIND_TRANSACTION_TOPIC, transactionExternalId))
        return result.data;
    }

    @Mutation(() => CreateTransactionResponse)
    async createFinancialTransaction(
        @Args()
        createTransaction: CreateTransactionRequest
    ) {
        const result = await firstValueFrom(this.kafkaClient
            .send(CREATE_TRANSACTION_TOPIC, JSON.stringify(createTransaction)))
        return result.data;
    }


}