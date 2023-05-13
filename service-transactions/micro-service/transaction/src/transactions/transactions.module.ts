import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../../../src/prisma/prisma.service';
import { TransactionsResolver } from './transactions.resolver'
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    providers: [TransactionsService, TransactionsResolver, PrismaService],
    exports: [
        TransactionsService
    ],
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['localhost:9092'],
                        clientId: 'transaction',
                    },
                    consumer: {
                        groupId: 'transaction-consumer',
                    },
                    producer: {
                        idempotent: true
                    },
                }
            }
        ])
    ],
})
export class TransactionsModule { }
