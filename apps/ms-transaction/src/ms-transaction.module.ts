import { Module } from '@nestjs/common';
import { MsTransactionController } from './ms-transaction.controller';
import { MsTransactionService } from './ms-transaction.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/service.configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDbModule } from './db/transaction/transaction.module';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';
import { MsTransactionAsyncController } from './ms-transaction.async.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
    TransactionDbModule,
  ],
  controllers: [MsTransactionController, MsTransactionAsyncController],
  providers: [MsTransactionService],
})
export class MsTransactionModule {}
