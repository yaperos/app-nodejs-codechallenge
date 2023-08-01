import { Module } from '@nestjs/common';
import { KafkaModule } from './shared/kafka/kafka.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [KafkaModule, TransactionModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
