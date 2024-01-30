import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TransactionModule } from './transaction/transaction.module';
import { KafkaModule } from './core/kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionModule,
  ],
})
export class AppModule {}
