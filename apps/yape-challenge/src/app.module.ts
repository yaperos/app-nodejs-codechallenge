import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partitioners } from 'kafkajs';
import {
  TransactionController,
  TransactionStatusController,
  TransactionTypeController,
} from './controllers';
import {
  TransaccionEntity,
  TransactionStatus,
  TransactionType,
} from './entities';
import { TransactionStatusService, TransactionTypeService } from './services';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_KAFKA',
        transport: Transport.KAFKA,
        options: {
          producer: { createPartitioner: Partitioners.LegacyPartitioner },
          client: {
            clientId: 'nestjs-kafka',
            brokers: [
              process.env.KAFKA_BROKER || process.env.DEFAULT_KAFKA_BROKER_URL,
            ],
            connectionTimeout:
              parseInt(process.env.KAFKA_CONNECTION_TIMEOUT, 10) || 5000,
            requestTimeout:
              parseInt(process.env.KAFKA_REQUEST_TIMEOUT, 10) || 6000,
            retry: {
              initialRetryTime:
                parseInt(process.env.KAFKA_RETRY_INITIAL_TIME, 10) || 1000,
              retries: parseInt(process.env.KAFKA_MAX_RETRIES, 10) || 10,
            },
          },
        },
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      TransaccionEntity,
      TransactionStatus,
      TransactionType,
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
  ],
  controllers: [
    TransactionController,
    TransactionTypeController,
    TransactionStatusController,
  ],
  providers: [
    TransactionService,
    TransactionTypeService,
    TransactionStatusService,
  ],
})
export class AppModule {}
