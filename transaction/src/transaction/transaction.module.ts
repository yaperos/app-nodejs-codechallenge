import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './models/transaction.entity';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [`${process.env.KAFKA_HOST}:9092`],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [
    TransactionController
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
