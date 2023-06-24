import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TransactionsModule } from './transactions/transactions.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
