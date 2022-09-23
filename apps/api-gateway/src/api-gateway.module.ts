import { KafkaModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { TRANSACTION_SERVICE } from './constans/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        KAFKA_ANTI_FRAUD_CONSUMER: Joi.string().required(),
        KAFKA_URI: Joi.string().required(),
        KAFKA_TRANSACTION_CONSUMER: Joi.string().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
    }),

    KafkaModule.register({ name: TRANSACTION_SERVICE }),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
