import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerModule } from '@app/apollo-server';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionsResolver } from './transaction.resolver';
import { Transaction } from './entities/transaction.entity';
import { KAFKA_SERVICES } from '@app/constants';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatusService } from './services/transactionStatus.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: KAFKA_SERVICES.ANTIFRAUD,
        transport: Transport.KAFKA,
        options: {
          client: {
            // clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
    ApolloServerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      username: process.env.POSTGRES_DB_USER,
      password: process.env.POSTGRES_DB_PASSWORD,
      port: parseInt(process.env.POSTGRES_DB_PORT),
      database: process.env.POSTGRES_DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
      // logging: true,
    }),
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionsResolver,
    TransactionStatusService,
  ],
})
export class TransactionModule {}
