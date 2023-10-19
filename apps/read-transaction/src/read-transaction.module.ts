import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisCache } from 'apollo-server-cache-redis';
import { join } from 'path';
import { GetTransactionHandler } from './application/handlers/get-transaction.handler';
import { TransactionEventHandler } from './application/handlers/transaction-event.handler';
import { TransactionMongooseRepository } from './domain/repositories/transaction.repository';
import { MongooseRepository } from './infraestructure/repository/mongoose.repository';
import { Transaction, TransactionSchema } from './infraestructure/schemas/transaction.schema';
import { ReadTransactionResolver } from './infraestructure/transaction.resolver';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ expandVariables: true }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cache: new RedisCache({ host: process.env.HOST, port: Number(process.env.REDIS_PORT) }),
      plugins: [
        ApolloServerPluginCacheControl({ defaultMaxAge: 30 }),
        responseCachePlugin()
      ],
      autoSchemaFile: join(process.cwd(), 'apps/read-transaction/src/schema.gql'),
    }),
  ],
  providers: [ReadTransactionResolver, GetTransactionHandler, TransactionEventHandler,
    {
      provide: TransactionMongooseRepository,
      useClass: MongooseRepository,
    }],
  controllers: [ReadTransactionResolver],
})
export class ReadTransactionModule { }
