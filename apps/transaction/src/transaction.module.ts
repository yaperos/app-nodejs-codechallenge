import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { KafkaModule } from '@app/common';
import { ANTI_FRAUD_SERVICE } from './constans/services';
import { TransactionRepository } from './transaction.repository';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        KAFKA_ANTI_FRAUD_CONSUMER: Joi.string().required(),
        KAFKA_URI: Joi.string().required(),
        KAFKA_TRANSACTION_CONSUMER: Joi.string().required(),
      }),
      envFilePath: './apps/transaction/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Transaction]),
    KafkaModule,
    KafkaModule.register({ name: ANTI_FRAUD_SERVICE }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
