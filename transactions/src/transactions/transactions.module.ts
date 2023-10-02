import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import TransactionController from "./transactions.controller";
import TransactionService from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import TransactionsEntity from "./transactions.entity";
import TransactionRepository from "./transactions.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionsEntity]),
        ClientsModule.register([
            {
                name: 'TRANSACTION_SERVICE',
                transport:Transport.KAFKA,
                options:{
                    client:{
                        clientId: 'transaction',
                        brokers: ['localhost:9092'],
                    },
                    consumer:{
                        groupId: 'transaction-consumer'
                    }
                }
            },
        ]),
        ClientsModule.register([
            {
                name: 'ANTI-FRAUD-VALIDATED',
                transport:Transport.KAFKA,
                options:{
                    client:{
                        clientId: 'ANTI-FRAUD-VALIDATED',
                        brokers: ['localhost:9092'],
                    },
                    consumer:{
                        groupId: 'anti-fraud-validated'
                    }
                }
            },
        ]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService,TransactionRepository]
})
export default class TransactionModule {}