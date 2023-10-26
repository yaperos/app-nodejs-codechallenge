import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateTransactionHandler } from "./application/handlers/create-transaction.handler";
import { GraphQLModule } from "@nestjs/graphql";
import { Module } from "@nestjs/common";
import { TransactionEntity } from "./infrastructure/entities/transaction.entity";
import { TransactionEventHandler } from "./application/handlers/transaction-event.handler";
import { TransactionRepository } from "./domain/repositories/transaction.repository";
import { TransactionResolver } from "./infrastructure/transaction.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmRepository } from "./infrastructure/repository/type-orm.repository";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.registerAsync([
      {
        name: "KAFKA_CLIENT",
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [process.env.KAFKA_BROKER],
              retry: {
                factor: 0.2,
                initialRetryTime: 1000,
                maxRetryTime: 3000,
                multiplier: 2,
                retries: 5,
              },
            },
            consumer: {
              groupId: process.env.WRITE_TRANSACTION_GROUP_ID,
            },
          },
        }),
      },
    ]),
    CqrsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        "context/write/src/schema.gql",
      ),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        database: process.env.POSTGRES_DB,
        entities: [TransactionEntity],
        host: process.env.HOST,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        synchronize: true,
        type: "postgres",
        username: process.env.POSTGRES_USER,
      }),
    }),
  ],
  providers: [
    CreateTransactionHandler,
    TransactionEventHandler,
    TransactionResolver,
    {
      provide: TransactionRepository,
      useClass: TypeOrmRepository,
    },
  ],
  controllers: [TransactionResolver],
})
export class WriteTransactionModule {}
