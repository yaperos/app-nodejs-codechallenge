import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import { MICROSERVICES_CONSTANTS } from '@yape-transactions/shared';

import { TransferController } from './infrastructure/transfer.controller';
import { TransactionRepositoryAdapter } from './infrastructure/transaction-repository.kafka.adapter';
import { TRANSACTION_REPOSITORY_PORT_TOKEN } from './domain/transaction-repository.port';
import { TransactionService } from './application/transaction.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];


@Module({
    imports: [
        CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: process.env.REDIS_URL ?? 'redis://localhost:6379',
            ttl: Number(process.env.REDIS_GLOBAL_TTL ?? '3000')
        }),
        ClientsModule.register([
            {
                name: MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.name,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'transfer-manager',
                        brokers,
                    },
                    consumer: {
                        groupId: MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.groupId,
                    },
                },
            },
        ]),
        /*,*/
    ],
    providers: [
        TransactionService,
        {
            provide: TRANSACTION_REPOSITORY_PORT_TOKEN,
            useClass: TransactionRepositoryAdapter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        }],
    controllers: [TransferController],
})
export class TransferModule { } 