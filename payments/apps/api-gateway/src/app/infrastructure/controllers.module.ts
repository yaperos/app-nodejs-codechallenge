import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient } from '@payments/shared/constant';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';

@Module({
    imports: [ClientsModule.register([
        {
            name: MicroserviceClient.Transaction,
            transport: Transport.TCP,
            options: {
                host: process.env.TRANSACTION_MICROSERVICE_HOST,
                port: parseInt(process.env.TRANSACTION_MICROSERVICE_PORT)
            }
        },
        {
            name: MicroserviceClient.Antifraud,
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'transaction',
                    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
                },
                producerOnlyMode: true,
                consumer: {
                    groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
                },
            }
        }
    ])],
    controllers: [TransactionController],
    providers: [TransactionService],
})
export class ControllersModule { }