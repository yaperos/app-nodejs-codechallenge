import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './infrastructure/config/configuration';
import { AntiFraudModule } from './infrastructure/modules/anti-fraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        KAFKA_URI: Joi.string().required(),
        KAFKA_ANTI_FRAUD_CONSUMER: Joi.string().required(),
        LIMIT_AMOUNT: Joi.number().default(1000),
      }),
      envFilePath: './apps/anti-fraud-ms/.env',
      load: [configuration],
    }),
    AntiFraudModule,
  ],
})
export class MsModule {}
