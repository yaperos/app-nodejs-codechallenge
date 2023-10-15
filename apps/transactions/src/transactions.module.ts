import { join } from 'path';
import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        join(__dirname, '..', 'model/entity/default/**/*.entity.{ts,js}'),
      ],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: process.env.KAFKA_SERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_TRANSACTIONS_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: process.env.KAFKA_ANTIFRAUD_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
