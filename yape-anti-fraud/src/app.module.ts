import { Module } from '@nestjs/common';
import { AntiFraudModule } from './modules/anti-fraud/anti-fraud.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
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
        TRANSACTION_KAFKA_HOST: Joi.string().required(),
        TRANSACTION_KAFKA_PORT: Joi.string().required(),
        TRANSACTION_KAFKA_NAME: Joi.string().required(),
        TRANSACTION_KAFKA_CLIENTID: Joi.string().required(),
        TRANSACTION_KAFKA_GROUPID: Joi.string().required(),
        TRANSACTION_LIMIT: Joi.number().required(),
      }),
    }),
    AntiFraudModule,
  ],
})
export class AppModule {}
