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
                host: '127.0.0.1',
                port: 5555
            }
        },
        {
            name: MicroserviceClient.Antifraud,
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'transaction',
                    brokers: ['localhost:9092'],
                },
                producerOnlyMode: true,
                consumer: {
                    groupId: 'transaction-consumer',
                },
            }
        }
    ])],
    controllers: [TransactionController],
    providers: [TransactionService],
})
export class ControllersModule { }