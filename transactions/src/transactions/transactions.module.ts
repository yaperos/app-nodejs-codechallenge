import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import TransactionController from "./transactions.controller";
import TransactionService from "./transactions.service";

@Module({
    imports: [
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
            }
        ])
    ],
    controllers: [TransactionController],
    providers: [TransactionService]
})
export default class TransactionModule {}