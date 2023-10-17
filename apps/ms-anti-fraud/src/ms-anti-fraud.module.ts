import { Module } from '@nestjs/common';
import { MsAntiFraudController } from './ms-anti-fraud.controller';
import { MsAntiFraudService } from './ms-anti-fraud.service';
import {
  CLIENT_ANTI_FRAUD_ID,
  CLIENT_ANTI_FRAUD_NAME,
  CoreLibraryModule,
  DATA_BASE_TYPE,
  GROUP_ID,
  Transaction,
  TransactionStatus,
  TransactionType,
  TransferType,
} from '@app/core-library';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
        name: CLIENT_ANTI_FRAUD_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: CLIENT_ANTI_FRAUD_ID,
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
  controllers: [MsAntiFraudController],
  providers: [MsAntiFraudService],
})
export class MsAntiFraudModule {}
