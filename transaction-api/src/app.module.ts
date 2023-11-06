import { Module } from '@nestjs/common';
import { TransactionsResolver } from './adapter/resolvers/transaction.resolver';
import { CreateTransactionHandler } from './application/commands/create-transaction.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionRepository } from './domain/repositories';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GetTransactionHandler } from './application/queries/get-transaction.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SendTransactionToValidateWhenIsPendingHandler } from './application/event-handlers/send-transaction-to-validate-when-is-pending.handler';
import { KafkaServerController } from './adapter/controllers/kafka-server.controller';
import { UpdateTransactionStatusHandler } from './application/commands/update-transaction-status.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionRepositoryImpl } from './infrastructure/repositories/transaction.repository';
import { Transaction } from './domain/models';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService);
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASS'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [Transaction],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [KafkaServerController],
  providers: [
    TransactionsResolver,
    CreateTransactionHandler,
    GetTransactionHandler,
    UpdateTransactionStatusHandler,
    SendTransactionToValidateWhenIsPendingHandler,
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
  ],
})
export class AppModule {}
