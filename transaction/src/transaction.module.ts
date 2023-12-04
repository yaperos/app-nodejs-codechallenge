import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_ANTI_FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'antifraud-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
