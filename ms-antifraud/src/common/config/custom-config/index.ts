import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvironmentService } from "../environment";
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        TRANSACTION_KAFKA_NAME: Joi.string().required(),
        TRANSACTION_KAFKA_HOST: Joi.string().required(),
        TRANSACTION_KAFKA_PORT: Joi.number().required(),
        TRANSACTION_KAFKA_CLIENT_ID: Joi.string().required(),
        TRANSACTION_KAFKA_GROUP_ID: Joi.string().required(),
        ANTIFRAUD_KAFKA_NAME: Joi.string().required(),
        ANTIFRAUD_KAFKA_HOST: Joi.string().required(),
        ANTIFRAUD_KAFKA_PORT: Joi.number().required(),
        ANTIFRAUD_KAFKA_CLIENT_ID: Joi.string().required(),
        ANTIFRAUD_KAFKA_GROUP_ID: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class CustomConfigModule { }