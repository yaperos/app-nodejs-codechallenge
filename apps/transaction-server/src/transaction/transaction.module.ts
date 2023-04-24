import {  Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionResolver } from './transaction.resolver';
@Module({
  imports: [
      ConfigModule.forRoot(),
      ClientsModule.register([{
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.LegacyPartitioner,
          }
        }
      }
    ]),
    RedisModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      sortSchema: true,
      autoSchemaFile: join(process.cwd(), 'apps/transaction-server/src/schema.gql'),
    })
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,TransactionResolver]
})
export class TransactionModule {}
