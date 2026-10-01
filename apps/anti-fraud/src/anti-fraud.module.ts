import { MessagingModule } from '@app/messaging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionCreatedConsumer } from './transaction-created.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot('anti-fraud-service'),
  ],
  providers: [TransactionCreatedConsumer],
})
export class AntiFraudModule {}
