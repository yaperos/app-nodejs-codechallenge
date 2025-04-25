import { Module } from '@nestjs/common';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './interface/transaction.controller';
import { TransactionRepository } from './infrastructure/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
