import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionEntity } from "./infraestructure/adapters/out/entities/transaction.entity";
import { HttpErrorFilter } from "./application/exceptions/http-error.filter";
import { APP_FILTER } from "@nestjs/core";
import { ConfigurationModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";
import { TransactionResolver } from "./infraestructure/adapters/in/resolvers/transaction.resolver";
import { CreateTransactionUseCase } from "./application/create-transaction.usecase";
import { TypeOrmRespositoryAdapter } from "./infraestructure/adapters/out/typeorm-repository.adapter";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateTransactionHandler } from "./application/commands/handlers/create-transaction.handler";
import { TransactionCreatedHandler } from "./application/events/handlers/transaction-created.handler";
import { KafkaEventMessageAdapter } from "./infraestructure/adapters/out/kafka-event-message.adapter";
import { UpdateTransactionStatusUseCase } from "./application/update-transaction-status.usecase";
import { KafkaMessageBrokerEvent } from "./infraestructure/adapters/in/events/kafka-message-broker.adapter";
import { UpdateTransactionStatusHandler } from "./application/commands/handlers/update-transaction-status.handler";
import { TransactionStatusUpdatedHanlder } from "./application/events/handlers/transaction-status-updated.handler";

export const CommandHandlers = [CreateTransactionHandler, UpdateTransactionStatusHandler];
export const EventHandlers = [TransactionCreatedHandler, TransactionStatusUpdatedHanlder];

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigurationModule],
            useFactory: async (configService: ConfigService) => (
                {
                    type: 'postgres' as 'postgres',
                    host: configService.get('DB_HOST'),
                    port: Number(configService.get('DB_PORT')),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    options: {
                        "encrypt": true,
                        "enableArithAbort": true
                    },
                    entities: ["dist/entity/**/*{.ts,.js}", TransactionEntity],
                    autoLoadEntities: true
                }
            ),
            inject: [ConfigService]
        }),
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_TRANSACTION_COMMAND_SERVICE',
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
        KafkaMessageBrokerEvent
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        TransactionResolver,
        CreateTransactionUseCase,
        UpdateTransactionStatusUseCase,
        TypeOrmRespositoryAdapter,
        KafkaEventMessageAdapter,
        ...CommandHandlers,
        ...EventHandlers
    ],
})
export class CommandModule { }