import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CONSTANTS } from '@yape-transactions/shared';

import { TransferController } from './infrastructure/transfer.controller';
import { TransactionRepositoryAdapter } from './infrastructure/transaction-repository.kafka.adapter';
import { TRANSACTION_REPOSITORY_PORT_TOKEN } from './domain/transaction-repository.port';
import { TransactionService } from './application/transaction.service';
// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];


@Module({
    imports: [
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
        }],
    controllers: [TransferController],
})
export class TransferModule { } 