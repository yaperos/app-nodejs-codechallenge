import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './config/configuration';
import { TransactionMsController } from './transaction-ms.controller';
import { TransactionMsService } from './transaction-ms.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        database: Joi.object({
          uri: Joi.string().required(),
        }),
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
  ],
  controllers: [TransactionMsController],
  providers: [TransactionMsService],
})
export class TransactionMsModule {}
