import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { OutboxEventPublisher } from './infrastructure/outbox-event-publisher';
import { TransactionEntity } from './infrastructure/repositories/entities/transaction.entity';
import { OutboxEventEntity } from './infrastructure/repositories/entities/outbox-event.entity';
import { KafkaClientModule } from './infrastructure/kafka/kafka-client.module';

import { CreateTransactionUseCaseImpl } from './application/usecases/create-transaction.usecase.impl';
import { GetTransactionUseCaseImpl } from './application/usecases/get-transaction.usecase.impl';
import { UpdateTransactionStatusUseCaseImpl } from './application/usecases/update-transaction-status.usecase.impl';

import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm-transaction.repository';
import { TypeOrmOutboxEventRepository } from './infrastructure/repositories/typeorm-outbox-event.repository';

import { KafkaEventPublisher } from './infrastructure/adapters/kafka-event-publisher.adapter';

import { TransactionMapper } from './presentation/mappers/transaction.mapper';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [TransactionEntity, OutboxEventEntity],
      synchronize: true,
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
