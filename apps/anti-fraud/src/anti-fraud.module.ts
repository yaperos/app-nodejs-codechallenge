import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaModule } from '@app/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        KAFKA_BROKER_URL: Joi.string().required(),
        KAFKA_TRANSACTION_SERVICE_CONSUMER: Joi.string().required(),
        KAFKA_ANTI_FRAUD_SERVICE_CONSUMER: Joi.string().required(),
      }),
      envFilePath: './apps/anti-fraud/.env',
    }),
    KafkaModule.register({ name: 'TRANSACTION_SERVICE' }),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
