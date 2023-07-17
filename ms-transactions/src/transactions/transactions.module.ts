import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transactions.entity';

config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: process.env.KAFKA_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAKKA_CLIENT,
            brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
