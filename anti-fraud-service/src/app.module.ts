import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
  ],
  providers: [TransactionsService],
})
export class AppModule {}
