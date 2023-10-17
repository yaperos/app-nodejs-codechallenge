import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  CLIENT_TRANSACTION_ID,
  CLIENT_TRANSACTION_NAME,
  CoreLibraryModule,
  DATA_BASE_TYPE,
  GROUP_ID,
  Transaction,
  TransactionStatus,
  TransactionType,
  TransferType,
} from '@app/core-library';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.environment',
    }),
    TypeOrmModule.forRoot({
      type: DATA_BASE_TYPE.POSTGRES,
      host: process.env.DATABASE_HOST,
      port: +process.env.DATA_BASE_PORT,
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Transaction,
      TransactionStatus,
      TransactionType,
      TransferType,
      Event,
    ]),
    ClientsModule.register([
      {
        name: CLIENT_TRANSACTION_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: CLIENT_TRANSACTION_ID,
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: GROUP_ID,
          },
        },
      },
    ]),
    CoreLibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
