import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { OutboxEventPublisher } from './infrastructure/outbox-event-publisher';
import { TransactionEntity } from './infrastructure/repositories/entities/transaction.entity';
import { OutboxEventEntity } from './infrastructure/repositories/entities/outbox-event.entity';
import { KafkaClientModule } from './infrastructure/kafka/kafka-client.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

import { CreateTransactionUseCaseImpl } from './application/usecases/create-transaction.usecase.impl';
import { GetTransactionUseCaseImpl } from './application/usecases/get-transaction.usecase.impl';
import { UpdateTransactionStatusUseCaseImpl } from './application/usecases/update-transaction-status.usecase.impl';

import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm-transaction.repository';
import { TypeOrmOutboxEventRepository } from './infrastructure/repositories/typeorm-outbox-event.repository';

import { KafkaEventPublisher } from './infrastructure/adapters/kafka-event-publisher.adapter';

import { TransactionMapper } from './presentation/mappers/transaction.mapper';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 3600,
        stores: [
          createKeyv(
            `redis://${configService.get<string>('app.redis.host', 'redis')}:${configService.get<number>('app.redis.port', 6379)}`,
          ),
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('app.database.host'),
        port: configService.get<number>('app.database.port'),
        username: configService.get<string>('app.database.username'),
        password: configService.get<string>('app.database.password'),
        database: configService.get<string>('app.database.database'),
        entities: [TransactionEntity, OutboxEventEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([TransactionEntity, OutboxEventEntity]),
    ScheduleModule.forRoot(),
    KafkaClientModule,
  ],
  controllers: [AppController, TransactionController],
  providers: [
    AppService,
    OutboxEventPublisher,

    {
      provide: 'CreateTransactionUseCase',
      useClass: CreateTransactionUseCaseImpl,
    },
    {
      provide: 'GetTransactionUseCase',
      useClass: GetTransactionUseCaseImpl,
    },
    {
      provide: 'UpdateTransactionStatusUseCase',
      useClass: UpdateTransactionStatusUseCaseImpl,
    },

    {
      provide: 'TransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: 'OutboxEventRepository',
      useClass: TypeOrmOutboxEventRepository,
    },

    {
      provide: 'EventPublisher',
      useClass: KafkaEventPublisher,
    },

    TransactionMapper,
  ],
})
export class AppModule {}
