import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TransactionsModule } from './transactions/transactions.module';
import * as Joi from 'joi';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        KAFKA_CLIENT_ID: Joi.string().required(),
        KAFKA_BROKER: Joi.string().required(),
        KAFKA_GROUP_ID: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    TransactionsModule,
    AntiFraudModule,
  ],
})
export class AppModule {}
