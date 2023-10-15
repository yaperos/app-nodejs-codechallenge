import { HttpStatus, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { DatabaseModule } from "./configuration/database/database.module";
import { TransactionService } from "./services/transaction.service";
import { TransactionHandler } from "./handlers/transaction.handler";
import { CreateTransactionEmitter } from "./emitter/create-transaction.emitter";
import { TransactionResolver } from "./resolvers/transaction.resolver";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { transactionEntityProviders } from "./providers";
import config from "./configuration/envs/config";
import { IGraphqlError } from "./configuration/filters/interfaces/error.interface";
import { ApolloServerErrorCode } from "@apollo/server/errors";

@Module({
  controllers: [TransactionHandler],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,

    ClientsModule.registerAsync([
      {
        name: "ANTI_FRAUD_SERVICE",
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: "anti-fraud-events-processor",
                brokers: [configService.get("kafka.broker")],
              },
              consumer: {
                groupId: "anti-fraud-consumer",
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        return {
          playground: configService.get<boolean>("graphql.playground"),
          autoSchemaFile: true,
          formatError: (error) => {
            const extensions = error.extensions as unknown as IGraphqlError;

            if (extensions.statusCode === HttpStatus.BAD_REQUEST) {
              return {
                message: error.message,
                validators: error.extensions.validators,
              };
            }
            if (
              extensions.code ===
              ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
            ) {
              return {
                message: error.message,
                status: HttpStatus.BAD_REQUEST,
              };
            }
            return {
              message: extensions.message as string,
              status: extensions.status,
            };
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    ...transactionEntityProviders,
    TransactionService,
    CreateTransactionEmitter,
    TransactionResolver,
  ],
})
export class AppModule {}
