import { Module} from "@nestjs/common";
import {TransactionResolver} from "./transaction.resolver";
import {TransactionService} from "./transaction.service";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {PrismaService} from "../../../../src/infrastructure/prisma/prisma.service";
import {TransactionLogRepository} from "./repository/transaction_log.repository";
import { TransactionRepository } from "./repository/transaction.repository";

@Module( {
    providers: [
        TransactionResolver,
        TransactionService,
        PrismaService,
        TransactionLogRepository,
        TransactionRepository,
        {
            provide: 'TransactionRepository',
            useClass: TransactionRepository
        },
        {
            provide: 'TransactionLogRepository',
            useClass: TransactionLogRepository
        },
    ],
    exports: [
        TransactionService
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
    ] })
export class TransactionModule {}