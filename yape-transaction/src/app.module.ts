import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { databaseConfig } from '@core/config/database';
import { SeedModule } from './modules/seed';
import { TransactionModule } from './modules/transaction';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        DATE_PATTERN: Joi.string().required(),
        TIMESTAMP_FORMAT: Joi.string().required(),
        MAX_SIZE: Joi.string().required(),
        MAX_DAYS: Joi.string().required(),
        KAFKA_HOST: Joi.string().required(),
        KAFKA_PORT: Joi.number().required(),
        KAFKA_GROUPID: Joi.string().required(),
        ANTIFRAUD_KAFKA_HOST: Joi.string().required(),
        ANTIFRAUD_KAFKA_PORT: Joi.number().required(),
        ANTIFRAUD_KAFKA_NAME: Joi.string().required(),
        ANTIFRAUD_KAFKA_CLIENTID: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_NAME: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_TTL: Joi.number().required(),
        REDIS_MAX: Joi.number().required(),
        SEED_INIT: Joi.boolean().required(),
      }),
    }),
    TransactionModule,
    SeedModule,
  ],
})
export class AppModule {}
