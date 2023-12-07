import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TransactionController } from './app.controller';
import commonConfig from './configs/common.config';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';
import { OutboxCronService } from './outbox/cron.service';
import { OutboxRelayService } from './outbox/outbox.service';
import { TransactionService } from './transaction/transaction.service';
import { TransactionEventsService } from './transaction/transaction-events.service';

@Module({
  imports: [
    KafkaModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [commonConfig],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    OutboxRelayService,
    OutboxCronService,
    TransactionEventsService,
  ],
})
export class AppModule {}
