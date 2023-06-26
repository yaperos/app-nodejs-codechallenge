import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisCacheModule } from './redis-cache.module';
import { KafkaModule } from './kafka.module';
import { TransactionsController } from 'src/controllers/transactions.controller';
import { SaveTransactionCommandHandler } from 'src/handlers/commands/save-transaction.command.handler';
import { UpdateTransactionCommandHandler } from 'src/handlers/commands/update-transaction.command.handler';
import { RetrieveTransactionQueryHandler } from 'src/handlers/queries/retrieve-transaction.query.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from 'src/models/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatedTransactionsConsumer } from 'src/consumers/transaction.consumer';
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionResolver } from 'src/resolvers/transaction.resolver';

export const CommandHandlers = [
  SaveTransactionCommandHandler,
  UpdateTransactionCommandHandler,
];
export const QueryHandlers = [RetrieveTransactionQueryHandler];

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    RedisCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        playground: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Transaction],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [
    ValidatedTransactionsConsumer,
    TransactionResolver,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class TransactionsModule {}
