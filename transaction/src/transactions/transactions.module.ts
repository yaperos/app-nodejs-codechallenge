import { Module } from '@nestjs/common';
import { TransactionController } from './infra/controllers/transactions.controller';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from './app/transaction.service';
import { TransactionRepository } from './infra/repository/transactions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './domain/entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { TransactionResolver } from './infra/graphql/transaction.resolver';

@Module({
  controllers: [TransactionController],
  providers: [ConfigService,TransactionService,TransactionRepository,TransactionController,TransactionResolver],
  imports:[
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transactions',
            brokers: ['localhost:9092'], 
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
],
  exports:[TransactionService,TransactionRepository]
})
export class TransactionsModule {}
