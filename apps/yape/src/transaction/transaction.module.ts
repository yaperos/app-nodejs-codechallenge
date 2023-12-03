import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionResolver } from 'apps/yape/src/transaction/transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),


    ClientsModule.register([
      {
        name: 'ANTIFRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  providers: [TransactionResolver, TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule { }
