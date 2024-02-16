import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from '@app/kafka';
import { TransactionResolver } from './transaction.resolver';
import { PrismaModule } from '@app/prisma';
import { EventsModule } from './events/events.module';
import { ApolloModule } from '@app/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        KAFKA_BROKER_URL: Joi.string().required(),
        KAFKA_TRANSACTION_SERVICE_CONSUMER: Joi.string().required(),
        KAFKA_ANTI_FRAUD_SERVICE_CONSUMER: Joi.string().required(),
      }),
      envFilePath: './apps/transaction/.env',
    }),
    ApolloModule.register(),
    KafkaModule.register({
      name: 'ANTI_FRAUD_SERVICE',
    }),
    PrismaModule,
    EventsModule,
  ],
  controllers: [],
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
