import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './infrastructure/config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from './infrastructure/modules/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        TRANSACTION_TYPES: Joi.string().required(),
        KAFKA_URI: Joi.string().required(),
        KAFKA_TRANSACTION_CONSUMER: Joi.string().required(),
      }),
      envFilePath: './apps/transaction-ms/.env',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    TransactionModule,
  ],
})
export class MsModule {}
