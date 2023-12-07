import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TransactionController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionService } from './transaction/transaction.service';

import commonConfig from './configs/common.config';

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
  providers: [TransactionService],
})
export class AppModule {}
