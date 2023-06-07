import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigurationModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";
import { CqrsModule } from "@nestjs/cqrs";
import { TransactionQueryUseCase } from "./application/transaction-query.usecase";
import { TransactionResolver } from "./infraestructure/adapters/in/resolvers/transaction.resolver";
import { GetTransactionsHandler } from "./application/queries/handlers/get-transaction.handler";
import { TypeOrmRespositoryAdapter } from "./infraestructure/adapters/out/typeorm-repository.adapter";
import { CreateTransactionUseCase } from "./application/create-transaction.usecase";
import { CreateTransactionHandler } from "./application/commands/handlers/create-transaction.handler";
import { KafkaMessageBrokerAdapter } from "./infraestructure/adapters/in/events/kafka-message-broker.adapter";
import { MongooseModule } from "@nestjs/mongoose";
import { Transactions, TransactionsSchema } from "./infraestructure/adapters/out/schemas/transaction.schema";
import { TransactionStatusUpdatedHanlder } from "src/commands/application/events/handlers/transaction-status-updated.handler";

export const QueryHandlers = [GetTransactionsHandler];
export const CommandHandlers = [CreateTransactionHandler];

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        MongooseModule.forRootAsync(
            {
                imports: [ConfigurationModule],
                useFactory: async (configService: ConfigService) => (
                    {
                        uri: configService.get('DB_MONGO_URL'),
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    }
                ),
                inject: [ConfigService],
            }
        ),
        MongooseModule.forFeature([
            {
                name: Transactions.name,
                schema: TransactionsSchema,
            }
        ]),
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_TRANSACTION_QUERY_SERVICE',
                imports: [ConfigurationModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: [configService.get('KAFKA_BROKER')],
                        }
                    }
                }),
                inject: [ConfigService],
            }
        ])
    ],
    controllers: [
        KafkaMessageBrokerAdapter
    ],
    providers: [
        TransactionResolver,
        CreateTransactionUseCase,
        TransactionQueryUseCase,
        TypeOrmRespositoryAdapter,
        ...QueryHandlers,
        ...CommandHandlers
    ],
})
export class QueryModule { }